import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../service/user.service';
import { JwtModule } from './jwt.module';
import { AdController } from 'src/controller/ad.controller';
import { AdService } from 'src/service/ad.service';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [AdController],
  providers: [UserService, AdService],
  exports: [UserService, AdService],
})
export class AdsModule {}
