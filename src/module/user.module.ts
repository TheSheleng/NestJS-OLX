import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../service/user.service';
import { UserController } from 'src/controller/user.controller';
import { JwtModule } from './jwt.module';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
