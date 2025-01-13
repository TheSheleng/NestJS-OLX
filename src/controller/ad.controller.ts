// ad.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  //   Patch,
  //   Delete,
  //   Get,
  //   Param,
  //   Query,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { AdService } from '../service/ad.service';
import { CreateAdDto } from 'src/dto/create-ad.dto';
//import { UpdateAdDto } from 'src/dto/update-ad.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from 'src/decorator/user.decorator';
import { config } from 'dotenv';

config();

@Controller('ads')
export class AdController {
  constructor(
    private readonly adService: AdService
  ) {}

  @Post('createAd')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', Number(process.env.AD_IMAGES_MAX_NUMBER), {
      storage: diskStorage({
        destination: './uploads/ads',
        filename: (req, file, callback) => {
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
  async createAd(
    @User() user,
    @Body() createAdDto: CreateAdDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    try{
      let imagesPath: string[] = [];

      images.forEach((e) => { 
        imagesPath.push(e.filename)
      })
  
      this.adService.createAd(
        user.id,
        createAdDto.title,
        createAdDto.price,
        imagesPath,
        createAdDto.category,
        createAdDto.description,
      )
  
      return {
        message: 'Publish successful'
      }
    }
    catch (error) 
    {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

    @Get('search')
    async searchAds(
      @Query('title') title: string,
      @Query('category') category: string,
    ) {
      try {
        const ads = await this.adService.searchAds(title, category);
        console.log(ads)
        return ads;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
}