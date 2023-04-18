import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {PrivateFile} from "./entities/privateFile.entity";
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import {v4 as uuid} from "uuid";

@Injectable()
export class PrivateFilesService {
    constructor(
        @InjectRepository(PrivateFile) private privateFilesRepository : Repository<PrivateFile>,
        private readonly configService : ConfigService
    ){}

    async uploadPrivateFiles(dataBuffer : Buffer, ownerId : number, filename : string){
        const s3 = new S3();
        const uploadResult = await s3.upload({
            Bucket : this.configService.get("AWS_PRIVATE_BUCKET_NAME"),
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`
        }).promise();

        const newFile = await this.privateFilesRepository.create({
            key: uploadResult.Key,
            owner : {
                id : ownerId
            }
        });

        await this.privateFilesRepository.save(newFile);

        return newFile;
    }

}
