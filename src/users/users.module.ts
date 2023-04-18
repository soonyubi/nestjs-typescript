import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { FilesModule } from 'src/files/files.module';
import { UsersController } from './user.controller';
import { PrivateFilesModule } from 'src/private-files/private-files.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),FilesModule,PrivateFilesModule],
  controllers:[UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
