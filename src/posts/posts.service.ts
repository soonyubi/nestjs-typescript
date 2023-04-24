import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import Post from './post.entity';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import PostNotFoundException from './exceptions/postNotFound.exception';
import User from '../users/entities/user.entity';
import PostsSearchService from './postSearch.service';
import {Cache} from "cache-manager";
import { GET_POSTS_CACHE_KEY } from './constant/postsCacheKey.constant';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService : PostsSearchService,
    @Inject(CACHE_MANAGER) private cacheManager : Cache
  ) {}

  async clearCache(){
    const keys : string[] = await this.cacheManager.store.keys();
    keys.forEach((key)=>{
      if(key.startsWith(GET_POSTS_CACHE_KEY)){
        this.cacheManager.del(key);
      }
    });
  }

  // SELECT * FROM post where id > startId OFFSET 10 LIMIT 10
  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }

    const [items, count] = await this.postsRepository.findAndCount({
      where,
      relations: ['author'],
      order: {
        id: 'ASC'
      },
      skip: offset,
      take: limit
    });

    return {
      items,
      count: startId ? separateCount : count
    }
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({where:{id}, relations: ['author'] });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user
    });
    await this.postsRepository.save(newPost);
    await this.postsSearchService.indexPost(newPost);
    await this.clearCache();
    return newPost;
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({where:{id}, relations: ['author'] });
    if (updatedPost) {
      await this.postsSearchService.update(updatedPost);
      return updatedPost
    }
    throw new PostNotFoundException(id);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
    await this.postsSearchService.remove(id);
    await this.clearCache();
  }

  async searchForPosts(text: string, offset?: number, limit?: number, startId?: number) {
    const { results, count } = await this.postsSearchService.search(text, offset, limit, startId);
    
    const ids = results.map(result => result.id);
    if (!ids.length) {
      return {
        items: [],
        count
      }
    }
    const items = await this.postsRepository
      .find({
        where: { id: In(ids) }
      });
    return {
      items,
      count
    }
  }
}
