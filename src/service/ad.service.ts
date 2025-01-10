import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from '../entity/ad.entity';
import { User } from '../entity/user.entity';
import { CreateAdDto } from 'src/dto/create-ad.dto';
import { UpdateAdDto } from 'src/dto/update-ad.dto';

@Injectable()
export class AdService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAd(createAdDto: CreateAdDto, userId: number): Promise<Ad> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const ad = this.adRepository.create({ ...createAdDto, owner: user });
    return this.adRepository.save(ad);
  }

  async updateAd(
    id: number,
    updateAdDto: UpdateAdDto,
    userId: number,
  ): Promise<Ad> {
    const ad = await this.adRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    if (ad.owner.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this ad');
    }

    Object.assign(ad, updateAdDto);
    return this.adRepository.save(ad);
  }

  async deleteAd(id: number, userId: number): Promise<void> {
    const ad = await this.adRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    if (ad.owner.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this ad');
    }

    await this.adRepository.delete(id);
  }

  async getAdById(id: number): Promise<Ad> {
    const ad = await this.adRepository.findOne({
      where: { id },
      relations: ['owner', 'category'],
    });
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    return ad;
  }

  async searchAds(title?: string, category?: string): Promise<Ad[]> {
    const query = this.adRepository.createQueryBuilder('ad');

    if (title) {
      query.andWhere('ad.title ILIKE :title', { title: `%${title}%` });
    }

    if (category) {
      query.andWhere('ad.category.name = :category', { category });
    }

    return query.getMany();
  }
}
