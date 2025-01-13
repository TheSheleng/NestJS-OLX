import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ad } from '../entity/ad.entity';
import { User } from '../entity/user.entity';
import { CreateAdDto } from 'src/dto/create-ad.dto';
import { UpdateAdDto } from 'src/dto/update-ad.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Category } from 'src/entity/category.entity';
import { AdImage } from 'src/entity/ad-image.entity';

@Injectable()
export class AdService {
  constructor(
    @Inject('AD_REPOSITORY')
    private readonly adRepository: Repository<Ad>,
    @Inject('AD_IMAGES_REPOSITORY')
    private readonly adImageRepository: Repository<Ad>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createAd(
    userId: number,
    title: string,
    price: number,
    imagesPath: string[],
    category?: Category,
    description?: string,
  ): Promise<Ad> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const ad = this.adRepository.create({ 
      title, 
      price,
      category, 
      description, 
      owner: user,
    });

    const savedAd = await this.adRepository.save(ad);

    const adImages = imagesPath.map((path) => {
      const adImage = new AdImage();
      adImage.url = path;
      adImage.ad = savedAd;
      return adImage;1
    });

    // Сохраняем все изображения разом
    await this.adImageRepository.save(adImages);

    // Возвращаем сохранённое объявление
    return savedAd;
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
    query.leftJoinAndSelect('ad.category', 'category')

    if (title) {
      query.andWhere('ad.title ILIKE :title', { title: `%${title}%` });
    }

    if (category) {
      query.andWhere('ad.category.name = :category', { category });
    }

    return query.getMany();
  }
}
