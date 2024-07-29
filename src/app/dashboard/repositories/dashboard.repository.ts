import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/platform/database/services/prisma.service";

@Injectable()
export class DashboardRepository {
  constructor(private readonly prismaService: PrismaService) { }

  public async paginate(paginateDto: any) {
    const [TotalNews, TotalCategories, TotalCrowdfunding,] = await Promise.all([
      this.prismaService.news.count({
        where: { deletedAt: null }
      }),
      this.prismaService.category.count({
        where: { deletedAt: null },

      }),
      this.prismaService.crowdfounding.count({
        where: { deletedAt: null },
      }),
    ]);
    return {
      TotalNews,
      TotalCategories,
      TotalCrowdfunding,
    };
  }

}