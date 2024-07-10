// import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from './user/user.module';
// import { UserHelperService } from './user/service/user-helper/user-helper.service';
// import { AuthModule } from './auth/auth.module';
// import { AuthMiddleware } from './middleware/auth.middleware';
// import { ChatModule } from './chat/chat.module';


// @Module({
//   imports: [
//     ConfigModule.forRoot({isGlobal: true}),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.POSTGRES_HOST,
//       port: parseInt(<string>process.env.POSTGRES_PORT),
//       username: process.env.POSTGRES_USER,
//       password: process.env.POSTGRES_PASSWORD,
//       database: process.env.POSTGRES_DATABASE,
//       autoLoadEntities: true,
//       synchronize: true,
//       logging: true, 
//     }),
//     UserModule,
//     AuthModule,
//     ChatModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService,],
// })

// // export class AppModule{}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .exclude(
//         { path: '/socket/users/login', method: RequestMethod.POST },
//         { path: '/socket/users', method: RequestMethod.POST },
//       ).forRoutes('*')
//   }}

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule 
implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .exclude(
        { path: 'localhost:3000/socket/users/login', method: RequestMethod.ALL},
        { path: '/socket/users', method: RequestMethod.ALL }
      )
      .forRoutes('*'); // Aplica a todas las rutas excepto las excluidas
  }
}

