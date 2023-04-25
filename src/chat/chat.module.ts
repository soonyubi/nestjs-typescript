import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './entities/message.entity';

@Module({
  imports: [ 
    AuthenticationModule,
    TypeOrmModule.forFeature([Message])
  ],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
