import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './module/user.module';
import { RedisCacheModule } from './module/redis-cache.module';
import { CustomMailerModule } from './module/mailer.module';
import { AdsModule } from './module/ads.module';

@Module({
  imports: [
    DatabaseModule, 
    CustomMailerModule, 
    RedisCacheModule, 
    UserModule, 
    AdsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
