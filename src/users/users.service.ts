import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import User from './entities/user.entity';
import CreateUserDto from './dto/createUser.dto';
import { FilesService } from 'src/files/files.service';
import { PrivateFilesService } from 'src/private-files/private-files.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly filesService: FilesService,
    private readonly privateFilesService : PrivateFilesService,
    private connection : Connection
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({where:{email}});
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({where:{id}});
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserIfRefreshTokenMatches(refreshToken : string, userId: number){
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    if(isRefreshTokenMatching) return user;
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null
      });
      await this.filesService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename);
    await this.usersRepository.update(userId, {
      ...user,
      avatar
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const queryRunner = await this.connection.createQueryRunner();
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    
    if (fileId) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try{
        await queryRunner.manager.update(User, userId, {
          ...user,
          avatar: null
        });
        // this code occurs error : isolation of transaction 
        // await this.filesService.deletePublicFile(fileId);
        await this.filesService.deletePublicFileWithQueryRunner(fileId, queryRunner);
        await queryRunner.commitTransaction();
      }
      catch(error){
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException();
      }
      finally{
        await queryRunner.release();
      }
    }
  }

  async addPrivateFile(userId : number, imageBuffer : Buffer, filename : string){
    return this.privateFilesService.uploadPrivateFiles(imageBuffer, userId, filename);
  }
  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.privateFilesService.getPrivateFiles(fileId);
    if (file.info.owner.id === userId) {
      return file;
    }
    throw new UnauthorizedException();
  }

  async setCurrentRefreshToken(refreshToken : string, userId : number){
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken
    });
  }
}
