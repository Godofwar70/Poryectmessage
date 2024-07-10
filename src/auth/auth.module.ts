import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategis/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';


@Module({
  imports:[
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async(configService:ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {expiresIn: '10000s'}
      })
    })
  ],
  exports:[AuthService],
  providers: [AuthService,JwtStrategy,JwtAuthGuard]
})
export class AuthModule {
 
}
