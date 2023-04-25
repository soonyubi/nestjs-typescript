import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import {Socket} from "socket.io";
import {parse} from "cookie";
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Message from './entities/message.entity';
import User from 'src/users/entities/user.entity';

@Injectable()
export class ChatService {
  
  constructor(
    private readonly authenticationService : AuthenticationService,
    @InjectRepository(Message) private messageRepository : Repository<Message>
  ){}

  async getUserFromSocket(socket : Socket){
    const cookie = socket.handshake.headers.cookie;
    const {Authentication : authenticationToken} = parse(cookie);
    const user = await this.authenticationService.getUserFromAuthenticationToken(authenticationToken);
    if(!user){
      throw new WsException('Invalid Credentails');
    }
    return user;
  }

  async saveMessage(content : string, author : User){
    const newMessage = await this.messageRepository.create({
      content,
      author
    });
    await this.messageRepository.save(newMessage);

    return newMessage;
  }

  async getAllMessages(){
    return this.messageRepository.find({relations:['author']});
  }
}
