import { Module } from '@nestjs/common';
import { PrivateFilesService } from './private-files.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateFile } from './entities/privateFile.entity';

@Module({
  imports:[ConfigModule, TypeOrmModule.forFeature([PrivateFile])],
  providers: [PrivateFilesService],
  exports:[PrivateFilesService]
})
export class PrivateFilesModule {}
