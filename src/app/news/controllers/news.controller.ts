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
  UseGuards,
} from '@nestjs/common';
import { NewsService } from '../services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateNewsDto, UpdateNewsDto } from '../dtos';
@ApiTags('Admin')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'news',
  version: '1',
})
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  /* The `@Post()` decorator above the `create` method in the `NewsController` class is specifying that
  this method should handle POST requests to the specified route. */
  @Post('create')
  public async create(@Body() CreateNewsDto: CreateNewsDto) {
    try {
      const data = await this.newsService.create(CreateNewsDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('get')
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
