import { Controller, UseGuards } from '@nestjs/common';
import { CrowdfoundinService } from '../services';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';

@ApiTags('Admin')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'crowdfounding',
  version: '1',
})
export class CrowdfoundingController {
  constructor(private readonly crowdfoundingService: CrowdfoundinService) {}
}
