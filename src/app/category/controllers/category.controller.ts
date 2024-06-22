import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { CategoryService } from '../services';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
@ApiTags('Admin')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'category',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post(':create')
  public async create(@Body() CreateCategoryDto: CreateCategoryDto) {
    try {
      const data = await this.categoryService.create(CreateCategoryDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('get')
  public async index(@Query() PaginationQueryDto: PaginationQueryDto) {
    try {
      const data = await this.categoryService.paginate(PaginationQueryDto);
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
      const data = await this.categoryService.detail(id);
      return new ResponseEntity({
        data,
        message: 'succes',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Delete('delete/:id')
  public async destroy(@Param('id') id: string) {
    try {
      const data = await this.categoryService.destroy(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Put('updaet/:id')
  public async update(
    @Param('id') id: string,
    @Body() UpdateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const data = await this.categoryService.update(id, UpdateCategoryDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
