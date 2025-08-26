import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/approvals')
export class ApprovalsController {
  constructor(private readonly approvals: ApprovalsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('mediator')
  @Post('requests')
  create(@Body() body: any) {
    return this.approvals.createRequest(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/decision')
  decide(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const actorId = req.user?.id;
    return this.approvals.decide(id, body?.decision, actorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.approvals.getApproval(id);
  }
}
