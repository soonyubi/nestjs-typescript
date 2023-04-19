import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import RequestWithUser from "../authentication/requestWithUser.interface";
import FindOneParams from "src/utils/findOneParams";

import { response } from "express";
import { Response } from "express";

@Controller("users")
export class UsersController{
    constructor(
        private readonly usersService: UsersService,
      ) {}

    @Post('avatar')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
      return this.usersService.addAvatar(request.user.id, file.buffer, file.filename);
    }

    @Delete('avatar')
    @UseGuards(JwtAuthenticationGuard)
    async deleteAvatar(@Req() request: RequestWithUser) {
      return this.usersService.deleteAvatar(request.user.id);
  }

    @Post("files")
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor("file"))
    async addPrivateFiles(@Req() request : RequestWithUser, @UploadedFile() file : Express.Multer.File){
      return this.usersService.addPrivateFile(request.user.id, file.buffer, file.filename);
    }

    @Get('files/:id')
    @UseGuards(JwtAuthenticationGuard)
    async getPrivateFile(@Req() request : RequestWithUser, @Param() {id} : FindOneParams, @Res() res : Response){
      const file = await this.usersService.getPrivateFile(request.user.id, +id);
      file.stream.pipe(res);
    }
    
}