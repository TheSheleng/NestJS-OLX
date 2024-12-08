/* eslint-disable @typescript-eslint/no-unused-vars */
// user.service.ts
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MoreThan, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {}

  // Creates a new user
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;

    // Checks whether such user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create a user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  // Creates a token for the user
  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;

    // Looking for a user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check for logical deletion
    if (user.deletedAt) {
      throw new UnauthorizedException('Account has been deleted');
    }

    // Create a token
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { token };
  }

  // Method for searching user by ID
  async findUserByIdOrThrow(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  // Method for searching user by Email
  async findByEmailOrThrow(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  // Method to extract user from token
  async findUserByToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.id;

      // We find the user only if deletedAt is null
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: null },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findUserByIdOrThrow(userId);

    // Updating the fields
    Object.assign(user, updateUserDto);

    // Saving the updated user
    return this.userRepository.save(user);
  }

  // Logical user deletion
  async softDelete(userId: number): Promise<void> {
    const user = await this.findUserByIdOrThrow(userId);

    // Marking the user as deleted
    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }

  // Create a token for password regeneration
  async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.findByEmailOrThrow(email);

    const token = crypto.randomBytes(32).toString('hex');
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expirationDate;
    await this.userRepository.save(user);

    return token;
  }

  // Find a user by his token
  async findUserByResetToken(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }
    return user;
  }

  // Allows user to reset his password using a token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.findUserByResetToken(token);
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
  }
}
