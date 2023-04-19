import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import Post from "./post.entity";
import PostSearchResult from "./types/postSearchResponse.interface";
import PostSearchBody from "./types/postSearchBody.interface";


@Injectable()
export default class PostsSearchService {
    index = 'posts';

    constructor(
        private readonly elasticSearchService : ElasticsearchService
    ){}

    async indexPost(post : Post){
        return this.elasticSearchService.index<PostSearchResult, PostSearchBody>({
            index: this.index,
            body:{
                id: post.id,
                title : post.title,
                content : post.content,
                authorId : post.author.id
            }
        });
    }

    async search(text : string){
        const {body} = await this.elasticSearchService.search<PostSearchResult>({
            index: this.index,
            body: {
                query : {
                    multi_match : {
                        query : text,
                        fields : ['title','content']
                    }
                }
            }
        });
        const hits = body.hits.hits;
        return hits.map((item)=>item._source);
    }

    async remove(postId : number){
        this.elasticSearchService.deleteByQuery({
            index : this.index,
            body: {
                query : {
                    match: {
                        id : postId
                    }
                }
            }
        });
    }

    async update(post : Post){
        const newBody : PostSearchBody = {
            id : post.id,
            title : post.title,
            content : post.content,
            authorId : post.author.id
        };
        // console.log(Object.entries(newBody));
        const script = Object.entries(newBody).reduce((result,[key,value])=>{
            // console.log('result : ', result);
            // console.log('key : ',key);
            // console.log('value : ',value);
            return `${result} ctx._source.${key}='${value}';`;
        },'');

        return this.elasticSearchService.updateByQuery({
            index : this.index,
            body : {
                query : {
                    match : {
                        id : post.id,
                    }
                },
                script : {
                    inline : script
                }
            }
        });
    }
}