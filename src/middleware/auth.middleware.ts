// import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { AuthService } from 'src/auth/service/auth.service';
// import { UserI } from 'src/user/model/user.interface';
// import { UserService } from 'src/user/service/user-servcie/user.service';


// export interface RequestModel extends Request{
//     user:UserI;
// }

// @Injectable()
// export class AuthMiddleware implements NestMiddleware{

//     // @Inject()
//     // private authService:AuthService;

//     // @Inject()
//     // private userService:UserService;
//     constructor(private authService:AuthService, private userService:UserService ){}

//     async use(req:RequestModel, res:Response, next:NextFunction){
    
            
//         // try {

            
//         //     console.log('Middleware de autenticación activado para la ruta:', req.path);
//         //     console.log("no se encuntra ", req.headers)
            
//         //     const tokenArray: string[] = req.headers['authorization'].split(' ');
//         //     const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
//         //     const user: UserI = await this.userService.getOne(decodedToken.id);
            
//         //     console.log(tokenArray)
//         //     if (user) {
//         //         req.user = user;
//         //         next();
//         //     } else {
//         //         throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
//         //     }
//         // } catch {
//         //     throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
//         // }

//           console.log('Middleware de autenticación activado para la ruta:', req.path);
      
//           try {
//             const authHeader = req.headers['authorization'];
//             if (!authHeader) {
//               console.log('Encabezado de autorización faltante');
//               throw new HttpException('Encabezado de autorización faltante', HttpStatus.UNAUTHORIZED);
//             }
      
//             const tokenArray: string[] = authHeader.split(' ');
//             if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
//               console.log('Formato de token incorrecto');
//               throw new HttpException('Formato de token incorrecto', HttpStatus.UNAUTHORIZED);
//             }
      
//             const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
//             const user: UserI = await this.userService.getOne(decodedToken.id);
      
//             if (user) {
//               req.user = user;
//               next();
//             } else {
//               throw new HttpException('Usuario no encontrado', HttpStatus.UNAUTHORIZED);
//             }
//           } catch (error) {
//             console.error('Error de autenticación:', error.message || error);
//             throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
//           }

       
//     }

// }

import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-servcie/user.service';

export interface RequestModel extends Request {
  user: UserI;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService, private userService: UserService) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    console.log('Middleware de autenticación activado para la ruta:', req.path);

    if (req.path === '/socket/users/login' || req.path === '/socket/users') {
      console.log('Ruta excluida del middleware:', req.path);
      return next();
    }

    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        console.log('Encabezado de autorización faltante');
        throw new HttpException('Encabezado de autorización faltante', HttpStatus.UNAUTHORIZED);
      }

      const tokenArray: string[] = authHeader.split(' ');
      if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
        console.log('Formato de token incorrecto');
        throw new HttpException('Formato de token incorrecto', HttpStatus.UNAUTHORIZED);
      }

      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      const user: UserI = await this.userService.getOne(decodedToken.id);

      if (user) {
        req.user = user;
        next();
      } else {
        throw new HttpException('Usuario no encontrado', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.error('Error de autenticación:', error.message || error);
      throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
    }
  }
}
