import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './module/user.module';
import { RedisCacheModule } from './module/redis-cache.module';
import { CustomMailerModule } from './module/mailer.module';

@Module({
  imports: [DatabaseModule, CustomMailerModule, RedisCacheModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
