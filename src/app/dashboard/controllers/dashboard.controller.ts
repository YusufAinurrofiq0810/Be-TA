import { Controller, Get, HttpException, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/app/auth";
import { RolesGuard } from "src/app/auth/guards/roles.guard";
import { Roles } from "src/app/role/decorators/role.decorator";
import { PaginationQueryDto } from "src/common/dtos/pagination-query.dto";
import { ResponseEntity } from "src/common/entities/response.entity";
import { DashboardService } from "../services";

@ApiTags('Admin')
@ApiSecurity('JWT')
@Controller({
  path: 'Dashboard',
  version: '1',
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }
  @Get('get')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  public async index(@Query() PaginationDto: PaginationQueryDto) {
    try {
      const data = await this.dashboardService.paginate(PaginationDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}