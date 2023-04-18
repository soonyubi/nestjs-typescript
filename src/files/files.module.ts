import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {FilesService} from "./files.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import PublicFile from "./entities/publicFile.entity";

@Module({
    imports:[ConfigModule,TypeOrmModule.forFeature([PublicFile])],
    providers:[FilesService],
    exports:[FilesService]
})


export class FilesModule{}