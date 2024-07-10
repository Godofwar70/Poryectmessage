import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { LoginResponseI } from 'src/user/model/dto/login-response.dto';
import { UserI } from 'src/user/model/user.interface';

const bcrypt = require('bcrypt');


@Injectable()
export class AuthService {

    constructor(private readonly jwtServices:JwtService){}

    generateJwt(user:UserI): Observable<string>{
        return from(this.jwtServices.signAsync({user}));
    }

    // generateJwt(user: UserI): Observable<string> {
    //     return from(this.jwtServices.signAsync({ user }, { expiresIn: '7d' })); // Expiración de 7 días
    // }

    // generateRefreshToken(user: UserI): Observable<string> {
    //     return from(this.jwtServices.signAsync({ user }, { expiresIn: '30d' })); // Expiración de 30 días para el refresh token
    // }

    hashPassword(password:string):Observable<string>{
        return from(<string>(bcrypt.hash( password, 12)));
    }

    comparePassword(password:string, storedPasswordHash: string):Observable<any>{
        return from(bcrypt.compare(password, storedPasswordHash));

    }

    verifyJwt(jwt:string): Promise<UserI>{
        console.log('Verificando JWT:', jwt);
        const user = this.jwtServices.verifyAsync(jwt);
        return user;
    }
}
