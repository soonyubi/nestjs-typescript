import { InjectRepository } from "@nestjs/typeorm";
import { GetCommentsQuery } from "../implementations/getComments.query";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import Comment from "src/comments/entities/comment.entity";
import { Repository } from "typeorm";

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery>{
    constructor(
        @InjectRepository(Comment) private commentsRepository : Repository<Comment>
    ){}

    async execute(query: GetCommentsQuery): Promise<any> {
        if(query.postId){
            return this.commentsRepository.findOne({where:{id:query.postId}});
        }
        return this.commentsRepository.find();
    }
}