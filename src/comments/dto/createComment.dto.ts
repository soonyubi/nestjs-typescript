import { IsNotEmpty, IsString,ValidateNested } from "class-validator";
import {Type} from "class-transformer";
import Post from "src/posts/post.entity";
import ObjectWithIdDto from "src/utils/types/objectWithId.dto";


export class CreateCommentDto{
    @IsString()
    @IsNotEmpty()
    content : string;

    @ValidateNested()
    @Type(()=>ObjectWithIdDto)
    post : Post;
}

export default CreateCommentDto;