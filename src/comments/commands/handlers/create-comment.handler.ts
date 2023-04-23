import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCommentCommand } from "../implementations/createComment.command";
import { InjectRepository } from "@nestjs/typeorm";
import Comment from "src/comments/entities/comment.entity";
import { Repository } from "typeorm";


@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand>{
    constructor(
        @InjectRepository(Comment) private commentsRepository : Repository<Comment>
    ){}
    
    async execute(command: CreateCommentCommand): Promise<any> {
        const newPost = await this.commentsRepository.create({
            ...command.comment, // content , post 
            author : command.author
        });

        await this.commentsRepository.save(newPost);

        return newPost;
    }
}