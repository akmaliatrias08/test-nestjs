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
  Req, 
  Query, 
  Headers
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageProfile } from './helpers/upload_profile';
import { join } from 'path';
import { of } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/export/pdf')
  async generatePdf(
    @Res() res: any, 
    @Headers() headers: any, 
    @Query('date') date: string
  ){
    try {
      const pdfBuffer = await this.usersService.generatePdfFromHtml(date)

      //set the res header 
      headers['content-type'] = 'application/pdf';
      headers['content-disposition'] = 'inline; filename=example.pdf'

      //send pdf file to response 
      res.end(pdfBuffer, 'binary')
    } catch (error) {
      console.log("Error generating PDf: ", error)
      res.status(500).json({ error: error })
    }
  }

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
  
  @Get('export')
  @UseGuards(AuthGuard('jwt'))
  async generatePdfUser(
    @Res() res: any,
    @Req() req,
    @Headers() headers: any
  ){
    const pdfBuffer = await this.usersService.generatePdfUser(req.user.id)

    //set header to response 
    headers['content-type']  = 'application/pdf'
    headers['content-disposition'] = 'inline; filename=example.pdf'

    res.end(pdfBuffer, 'binary')
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.usersService.create(createUserDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const [data, count] = await this.usersService.findAll(page, limit);

    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.usersService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
