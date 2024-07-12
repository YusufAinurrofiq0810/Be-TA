import {
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
  Req,
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
import { role } from '@prisma/client';
import { RolesGuard } from 'src/app/auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { Roles } from 'src/app/role/decorators/role.decorator';
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
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Roles('Admin') // Specify the roles allowed to access this endpoint
  public async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNewsDto: CreateNewsDto,
    @Req() request,
  ) {
    try {
      if (file) {
        createNewsDto.image = `${request.protocol}://${request.get('Host')}/${file.path.replace(/\\/g, '/')}`;
      }

      const data = await this.newsService.create(createNewsDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
  @UseGuards(AuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  public async update(
    @Param('id') id: string,
    @Body() UpdateNewsDto: UpdateNewsDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request,
  ) {
    try {
      const updateData = {
        ...UpdateNewsDto,
        image: image ? `${request.protocol}://${request.get('Host')}/${image.path.replace(/\\/g, '/')}` : undefined,
      }
      console.log(updateData);

      const data = await this.newsService.update(id, updateData,);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
