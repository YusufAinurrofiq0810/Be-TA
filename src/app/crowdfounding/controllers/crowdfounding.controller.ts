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
import { RolesGuard } from 'src/app/auth/guards/roles.guard';
import { role } from '@prisma/client';
import { wihtdrawCrowdfounding } from '../dtos/create-withdraw.dto';
import { Roles } from 'src/app/role/decorators/role.decorator';

@ApiTags('Admin')
@ApiSecurity('JWT')
@Controller({
  path: 'crowdfounding',
  version: '1',
})
export class CrowdfoundingController {
  constructor(private readonly crowdfoundingService: CrowdfoundingService) { }
  @Post('create')
  @UseGuards(AuthGuard, new RolesGuard([role.Admin]))
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
  @Get('get')
  @UseGuards(AuthGuard)
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
  @Get('get/:id')
  @UseGuards(AuthGuard)
  public async detail(@Param('id') id: string) {
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
  @Delete('delete/:id')
  @UseGuards(AuthGuard, new RolesGuard([role.Admin]))
  public async destroy(@Param('id') id: string) {
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
  @Put('update/:id')
  @UseGuards(AuthGuard, new RolesGuard([role.Admin]))
  public async update(
    @Param('id') id: string,
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

  @Roles('Admin')
  @Post('withdraw/:id')
  async withdraw(@Param('id') id: string, @Body() body: wihtdrawCrowdfounding) {
    return await this.crowdfoundingService.withdraw(id, body)
  }
  // @Get('export')
  // public async export() {
  //   try {
  //     return new ResponseEntity({
  //       data: await this.crowdfoundingService.export(),
  //       message: 'success',
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
