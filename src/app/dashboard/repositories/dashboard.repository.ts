import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/platform/database/services/prisma.service";

@Injectable()
export class DashboardRepository {
  constructor(private readonly prismaService: PrismaService) { }

  public async paginate(paginateDto: any) {
    const [TotalNews, TotalCategories, TotalCrowdfunding,] = await Promise.all([
      this.prismaService.news.count(),
      this.prismaService.category.count(),
      this.prismaService.crowdfounding.count(),
    ]);
    return {
      TotalNews,
      TotalCategories,
      TotalCrowdfunding,
    };
  }

}