import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { FilesModule } from '../files/files.module';
import { UsersController } from './user.controller';
import { PrivateFilesModule } from '../private-files/private-files.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),FilesModule,PrivateFilesModule],
  controllers:[UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
