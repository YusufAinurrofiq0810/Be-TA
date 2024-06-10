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
import { CrowdfoundingService } from '../services';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateCrowdfoundingDto, UpdateCrowdfoundingDto } from '../dtos';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@ApiTags('Admin')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'crowdfounding',
  version: '1',
})
export class CrowdfoundingController {
  constructor(private readonly crowdfoundingService: CrowdfoundingService) {}
  @Post()
  public async create(@Body() CreateCrowdfoundingDto: CreateCrowdfoundingDto) {
    try {
      const data = await this.crowdfoundingService.create(
        CreateCrowdfoundingDto,
      );
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get()
  public async index(@Query() PaginationDto: PaginationQueryDto) {
    try {
      const data = await this.crowdfoundingService.paginate(PaginationDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Get(':id')
  public async detail(@Param('id') id: number) {
    try {
      const data = await this.crowdfoundingService.detail(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Delete(':id')
  public async destroy(@Param('id') id: number) {
    try {
      const data = await this.crowdfoundingService.destroy(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() UpdateCrowfoundingDto: UpdateCrowdfoundingDto,
  ) {
    try {
      const data = await this.crowdfoundingService.update(
        id,
        UpdateCrowfoundingDto,
      );
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
