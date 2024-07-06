import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from '../services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateNewsDto, UpdateNewsDto } from '../dtos';
import { diskStorage } from 'multer'
import { role } from '@prisma/client';
import { RolesGuard } from 'src/app/auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

function fileSizeFilter(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (file.size > MAX_FILE_SIZE) {
    cb(
      new BadRequestException(
        `File ${file.originalname} exceeds the 2MB size limit`,
      ),
      false,
    );
  } else {
    cb(null, true);
  }
}
@ApiTags('Admin')
@ApiSecurity('JWT')
@Controller({
  path: 'news',
  version: '1',
})
export class NewsController {
  constructor(private readonly newsService: NewsService) { }
  /* The `@Post()` decorator above the `create` method in the `NewsController` class is specifying that
  this method should handle POST requests to the specified route. */
  @Post('create')
  @UseGuards(AuthGuard, new RolesGuard([role.Admin]))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/news',
      filename: (req, file, cb) => {
        const randomName = Array(4)
          .fill(null)
          .map(() => Math.round(Math.random() * 10).toString(10))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
        // const filename = `news-image_${extname(file.originalname)}`;
        // cb(null, filename)
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (file.size > 2 * 1024 * 1024) {
        cb(
          new BadRequestException('ukuran file Maximal 2 MB'),
          false,
        );
      } else {
        cb(null, true);
      }
    },
  }),
  )
  public async create(@UploadedFile() file: Express.Multer.File, @Body() CreateNewsDto: CreateNewsDto) {
    try {
      const image = file.filename
      const data = await this.newsService.create(CreateNewsDto, image);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      console.log(error)
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('get')
  @UseGuards(AuthGuard)
  public async index(@Query() PaginationDto: PaginationQueryDto) {
    try {
      const data = await this.newsService.paginate(PaginationDto);
      return new ResponseEntity({
        data,
        message: 'succes',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Get('get/:id')
  @UseGuards(AuthGuard)
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.newsService.detail(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Delete('delete/:id')
  @UseGuards(AuthGuard, new RolesGuard([role.Admin]))
  public async destroy(@Param('id') id: string) {
    try {
      const data = await this.newsService.destroy(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Put('update/:id')
  @UseGuards(AuthGuard, new RolesGuard([role.Admin]))
  public async update(
    @Param('id') id: string,
    @Body() UpdateNewsDto: UpdateNewsDto,
  ) {
    try {
      const data = await this.newsService.update(id, UpdateNewsDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
