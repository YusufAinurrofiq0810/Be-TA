import { Injectable } from "@nestjs/common";
import { PaginationQueryDto } from "src/common/dtos/pagination-query.dto";
import { DashboardRepository } from "../repositories";

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) { }
  public paginate(paginateDto: PaginationQueryDto) {
    return this.dashboardRepository.paginate(paginateDto);
  }
}