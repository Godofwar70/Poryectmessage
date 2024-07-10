import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { AuthService } from 'src/auth/service/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[AuthModule, UserModule],
  providers: [ChatGateway]
})
export class ChatModule {}
