import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user-servcie/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { UserHelperService } from './service/user-helper/user-helper.service';
import { AuthService } from 'src/auth/service/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({

  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports:[UserService]
})
export class UserModule {}
