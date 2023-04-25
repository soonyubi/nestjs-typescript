import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [ AuthenticationModule],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
