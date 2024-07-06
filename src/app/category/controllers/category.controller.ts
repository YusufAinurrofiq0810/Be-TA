/* eslint-disable prettier/prettier */
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
import { RolesGuard } from 'src/app/auth/guards/roles.guard';
import { Roles } from 'src/app/auth/decorators/roles.decorator';
@ApiTags('Admin')
@ApiSecurity('JWT')
@Controller({
  path: 'category',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
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
  @Get()
  @UseGuards(AuthGuard)
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
  @Get(':id')
  @UseGuards(AuthGuard)
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
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
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
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
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
