import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/service/auth.service';
import {Socket,Server} from 'socket.io'
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-servcie/user.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@WebSocketGateway({cors: {origin: ['https://hoppscotch.io', 'http://localhost:3000','http://localhost:4200']}})  

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer()
  server:Server

  title: string[] = [];
  
  constructor(private authService: AuthService, private userService: UserService){}

  // @SubscribeMessage('message')

  // handleMessage(client: any, payload: any){
  //   this.server.emit('message', 'test')
  // }
  @UseGuards(JwtAuthGuard)
  async handleConnection(socket: Socket) {

    try {
      const jwt = await socket.handshake.headers.authorization;
      const decodedToken = await this.authService.verifyJwt(jwt);
      const user: UserI = await this.userService.getOne(decodedToken.id);

      if(!user){
        return this.disconnect(socket)
      }else{
        this.title.push( 'Value' + Math.random.toString());
        this.server.emit('message', this.title)
      }
    
    console.log('On Connect')
      
    } catch (error) {
      return this.disconnect(socket)
    }
    
  }

  handleDisconnect(socket: Socket) {
      socket.disconnect()
  }

  private disconnect(socket:Socket){
    socket.emit('Error', new UnauthorizedException )
    socket.disconnect();
  }

}
