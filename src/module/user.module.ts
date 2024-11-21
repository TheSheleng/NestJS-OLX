import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from '../providers/user.providers';
import { UserService } from '../service/user.service';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
})
export class UserModule {}
