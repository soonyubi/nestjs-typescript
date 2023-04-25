import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {Server} from "socket.io";

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server : Server;

  @SubscribeMessage("send_message")
  findAll(@MessageBody() data : any){
    this.server.sockets.emit("receive_message",data);
  }

  @SubscribeMessage("initial_connection")
  async identity(@MessageBody() data : any){
    return "hello world!";
  }
}
