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
import { CrowdfoundingService } from '../services';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateCrowdfoundingDto, UpdateCrowdfoundingDto } from '../dtos';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { RolesGuard } from 'src/app/auth/guards/roles.guard';
import { Roles } from 'src/app/auth/decorators/roles.decorator';
import { wihtdrawCrowdfounding } from '../dtos/create-withdraw.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@ApiTags('Admin')
@ApiSecurity('JWT')
@Controller({
  path: 'crowdfounding',
  version: '1',
})
export class CrowdfoundingController {
  constructor(private readonly crowdfoundingService: CrowdfoundingService) { }
  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  public async create(
    @Body() createCrowdfoundingDto: CreateCrowdfoundingDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request,
  ) {
    try {
      if (image) {
        createCrowdfoundingDto.image = `${request.protocol}://${request.get('Host')}/${image.path.replace(/\\/g, '/')}`
      }
      const data = await this.crowdfoundingService.create(createCrowdfoundingDto);
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  public async update(
    @Param('id') id: string,
    @Body() UpdateCrowfoundingDto: UpdateCrowdfoundingDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request,
  ) {
    try {
      const updateData = {
        ...UpdateCrowfoundingDto,
        image: image ? `${request.protocol}://${request.get('Host')}/${image.path.replace(/\\/g, '/')}` : undefined,
      };
      const data = await this.crowdfoundingService.update(
        id,
        updateData,
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
  // @Roles('Admin')
  // @Get('export/:id')
  // public async export(@Param('id') id: string) {
  //   try {
  //     return new ResponseEntity({
  //       data: await this.crowdfoundingService.export(id),
  //       message: 'success',
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
