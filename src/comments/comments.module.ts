import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comments from './entities/comment.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
    imports:[TypeOrmModule.forFeature([Comments]),CqrsModule],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class CommentsModule {}
