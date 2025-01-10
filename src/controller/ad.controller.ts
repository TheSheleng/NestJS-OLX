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
} from '@nestjs/common';
import { AdService } from '../service/ad.service';
import { CreateAdDto } from 'src/dto/create-ad.dto';
//import { UpdateAdDto } from 'src/dto/update-ad.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import path from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('ads')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
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
    if (images) {
      createAdDto.images = images.map(
        (file) => `/uploads/ads/${file.filename}`,
      );
    }
    return await this.adService.createAd(createAdDto, user);
  }

  //   @Patch(':id')
  //   @UseGuards(JwtAuthGuard)
  //   async updateAd(
  //     @Param('id') id: number,
  //     @Body() updateAdDto: UpdateAdDto,
  //     @User() user,
  //   ) {
  //     try {
  //       const updatedAd = await this.adService.updateAd(id, updateAdDto, user.id);
  //       return {
  //         message: 'Ad updated successfully',
  //         ad: updatedAd,
  //       };
  //     } catch (error) {
  //       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //     }
  //   }

  //   @Delete(':id')
  //   @UseGuards(JwtAuthGuard)
  //   async deleteAd(@Param('id') id: number, @User() user) {
  //     try {
  //       await this.adService.deleteAd(id, user.id);
  //       return { message: 'Ad deleted successfully' };
  //     } catch (error) {
  //       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //     }
  //   }

  //   @Get(':id')
  //   async getAdById(@Param('id') id: number) {
  //     try {
  //       const ad = await this.adService.getAdById(id);
  //       return ad;
  //     } catch (error) {
  //       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //     }
  //   }

  //   @Get()
  //   async searchAds(
  //     @Query('title') title: string,
  //     @Query('category') category: string,
  //   ) {
  //     try {
  //       const ads = await this.adService.searchAds(title, category);
  //       return ads;
  //     } catch (error) {
  //       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //     }
  //   }
}

function uuidv4() {
  throw new Error('Function not implemented.');
}
// function FilesInterceptor(arg0: string, arg1: number, arg2: { storage: any; fileFilter: (req: any, file: any, callback: any) => any; }): Function | import("@nestjs/common").NestInterceptor<any, any> {
//     throw new Error('Function not implemented.');
// }

// function diskStorage(arg0: { destination: string; filename: (req: any, file: any, callback: any) => void; }) {
//     throw new Error('Function not implemented.');
// }

// function uuidv4() {
//     throw new Error('Function not implemented.');
// }
