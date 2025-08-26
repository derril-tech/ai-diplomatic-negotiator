import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalsService } from './approvals.service';
import { ApprovalsController } from './approvals.controller';
import { Approval } from '../database/entities/approval.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Approval])],
  controllers: [ApprovalsController],
  providers: [ApprovalsService],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
