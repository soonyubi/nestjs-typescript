import { Body, ClassSerializerInterceptor, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import CreateCommentDto from './dto/createComment.dto';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';


@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
    constructor(
        private commandBus : CommandBus
    ){}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createComment(@Body() comment : CreateCommentDto, @Req() req : RequestWithUser){
        const user = req.user;
       
    }
}
