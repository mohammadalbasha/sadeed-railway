import { Ability } from '@casl/ability';
import { BadRequestException, Controller, Get, NotFoundException, Param, Post, Request, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CurrentAbility } from '../auth/decorators/currentAbility.decorator';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import { IsNotGraphQL } from '../auth/decorators/isNotGraphQL.decorator';
import { Action } from '../authorization/casl/action.enum';
import { Can } from '../authorization/casl/checkPolicies.decorator';
import { User } from '../user/user.model';
import { MediaFile } from '../file/file.model'
import { env } from 'process';
import ModelService from 'src/modules/models.service';
import { MediaFileService } from './file.service';
import { Public } from '../auth/decorators/isPublic.decorator';
import { createReadStream, existsSync } from 'fs';
import { extname, join } from 'path';
import { Response } from '@nestjs/common'
import { fileFilter } from './file.filter'
import { v4 as uuid } from 'uuid';
import { Cookies } from 'src/common/decorators/restCookie.decorator';



@Controller()
export class FileController {
  constructor(protected Models: ModelService, protected mediaFileService: MediaFileService) {
  }

  @IsNotGraphQL()
  @Post('file/upload/public')
  @Can([Action.Create, MediaFile])
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: +env.MaxPublicFileUploadSize,
    },
    storage: diskStorage({
      destination: env.PublicLocalStoragePath || './public',
      filename: (req: any, file: any, cb: any) => {
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
    fileFilter: fileFilter(['rtf', 'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'ico'], 10000000)
  }))
  async uploadPublicFile(@Request() req, @CurrentUser() user: User, @CurrentAbility() ability: Ability, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file selected")

    const mediaFile = this.mediaFileService.saveFile(file, user)
    return mediaFile
  }


  @IsNotGraphQL()
  @Post('file/upload/private')
  @Can([Action.Create, MediaFile])
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: +env.MaxPrivateFileUploadSize,
    },
    storage: diskStorage({
      destination: env.PrivateLocalStoragePath || './upload',
    }),
    fileFilter: fileFilter(['rtf', 'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'ico'], 10000000)
  }))
  async uploadPrivateFile(@Request() req, @CurrentUser() user: User, @CurrentAbility() ability: Ability, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file selected")

    const mediaFile = this.mediaFileService.saveFile(file, user, false)
    return mediaFile
  }

  
  @Public()
  @IsNotGraphQL()
  @Get('file/:id')
  async downloadPrivateFile(@Response({ passthrough: true }) res, @Param('id') id: string, @CurrentAbility() ability: Ability, @Request() req, @Cookies('token') token) {
    try {
      const mediaFile = await this.Models.model(MediaFile).findById(id)
      // todo authorize download by cookies
      // const mediaFile = await this.Models.model(MediaFile).findById(id).accessibleBy(ability)

      if (!mediaFile) throw new NotFoundException();

      if (!existsSync(mediaFile.path)) {
        throw new NotFoundException();
      }

      res.set({
        'Content-Type': mediaFile.mimeType,
        'Content-Disposition': 'attachment; filename="'+mediaFile.originalName+'"',
      });

      const file = createReadStream(join(process.cwd(), mediaFile.path));
      return new StreamableFile(file);
    } catch(err) {
      throw new NotFoundException();
    }
    
  }
}
