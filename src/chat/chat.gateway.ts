import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {Server, Socket} from "socket.io";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly chatService: ChatService) {}
  
  async handleConnection(socket : Socket) {
    await this.chatService.getUserFromSocket(socket);
  }

  @WebSocketServer()
  server : Server;

  @SubscribeMessage("send_message")
  async listenForMessages(@MessageBody() content : string, @ConnectedSocket() socket : Socket){

    const author = await this.chatService.getUserFromSocket(socket);

    this.server.sockets.emit("receive_message",{
      content,
      author
    });
  }

}
