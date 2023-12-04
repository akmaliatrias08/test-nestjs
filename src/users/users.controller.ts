import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res, 
  Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '#/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageProfile } from './helpers/upload_profile';
import { join } from 'path';
import { of } from 'rxjs';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storageProfile))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (typeof file?.filename == "undefined") {
        return {
          statusCode: HttpStatus.BAD_REQUEST, 
          message: "error file cannot be upload"
        }
    } else {
        return {fileName: file?.filename}
    }
  }

  @Get('upload/:image')
  getImage(@Param('type') type: string,@Param('image') imagePath: string, @Res() res: any){
    return of(
      res.sendFile(join(process.cwd(), `upload/profile/${imagePath}`))
    )
  }
  
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.usersService.create(createUserDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const [data, count] = await this.usersService.findAll();

    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.usersService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      data: await this.usersService.update(id, updateUserDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
