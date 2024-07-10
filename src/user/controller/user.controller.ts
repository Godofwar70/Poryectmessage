import { Body, Controller, Get,Post, Query} from '@nestjs/common';
import { UserService } from '../service/user-servcie/user.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { UserI } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/create-user-dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';

import { LoginResponseI } from '../model/dto/login-response.dto';
import { AuthService } from 'src/auth/service/auth.service';


@Controller('users')
export class UserController {

    constructor(
        private userServices:UserService,
        private userHelperService:UserHelperService,
        private readonly authService: AuthService
    ){}


    @Post()
    create(@Body() createUserDto: CreateUserDto):Observable<UserI>{

        return this.userHelperService.createUserDtoToEntity(createUserDto).pipe(
            switchMap((user: UserI) => this.userServices.create(user))
        )
    }


    @Get()
    findAll(
        @Query('page') page:number = 1,
        @Query ('limit') limit : number = 10
    ): Observable<Pagination<UserI>>{
        limit = limit > 100 ? 100:limit;

        return this.userServices.findAll({page, limit, route: 'http://localhost:3000/socket/users'})
    }

    @Post('login')
    login(@Body() loginUserDto:LoginUserDto): Observable<LoginResponseI>{
        return this.userHelperService.loginUserDtoToEntity(loginUserDto).pipe(
            switchMap((user:UserI) => this.userServices.login(user).pipe(
                map((jwt:string) =>{
                    return {
                        acces_token: jwt,
                        token_type: 'JWT',
                        expires_in: 10000
                    };
                })
            ))
        )

    }

    // @Post('refresh-token')
    // async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<string> {
    //     try {
    //         const decoded = await this.authService.verifyJwt(refreshTokenDto.refreshToken);
    //         const user: UserI = decoded.user;
    //         return this.authService.generateJwt(user).toPromise();
    //     } catch (error) {
    //         throw new HttpException('Refresh token inválido', HttpStatus.UNAUTHORIZED);
    //     }
    // }


}


