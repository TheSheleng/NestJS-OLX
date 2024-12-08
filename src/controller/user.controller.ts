// src/controllers/user.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Delete,
  Req,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { Request } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetUserPasswordDto } from 'src/dto/reset-user-password.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    // Register
    const user = await this.userService.register(registerUserDto);

    if (!user) {
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }

    // Login
    const token = await this.userService.login({
      email: registerUserDto.email,
      password: registerUserDto.password,
    });

    return {
      message: 'Registration and login successful',
      token,
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    // Create token
    const token = await this.userService.login(loginUserDto);

    return {
      message: 'Login successful',
      token,
    };
  }

  @Patch('me')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          if (!file) {
            return callback(new Error('No file uploaded'), null);
          }
          const fileExtName = path.extname(file.originalname);
          const fileName = `${uuidv4()}${fileExtName}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateUser(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    // Getting the current user from the token
    const user = await this.userService.findUserByToken(
      req.headers.authorization,
    );

    // If the avatar has been loaded, add the URL to the DTO
    if (avatar) {
      const avatarUrl = `/uploads/avatars/${avatar.filename}`;
      updateUserDto.avatar = avatarUrl;
    }

    // We update user data through the service
    const updatedUser = await this.userService.updateUser(
      user.id,
      updateUserDto,
    );

    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  // Method for deleting an account by a user
  @Delete('me')
  async softDeleteSelf(@Req() req: Request) {
    const user = await this.userService.findUserByToken(
      req.headers.authorization,
    );

    await this.userService.softDelete(user.id);
    return { message: 'Your account has been deleted successfully.' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const token = await this.userService.generateResetPasswordToken(email);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './reset-password',
      context: {
        token,
      },
    });

    return { message: 'Password reset link sent' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetUserPasswordDto: ResetUserPasswordDto) {
    await this.userService.resetPassword(
      resetUserPasswordDto.token,
      resetUserPasswordDto.newPassword,
    );
    return { message: 'Password has been reset' };
  }
}
