import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from '../database/entities/approval.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalsRepo: Repository<Approval>,
  ) {}

  async createRequest(payload: Partial<Approval>) {
    const approval = this.approvalsRepo.create({
      ...payload,
      status: 'pending',
    } as any);
    return this.approvalsRepo.save(approval);
  }

  async getApproval(id: string) {
    return this.approvalsRepo.findOne({ where: { id } });
  }

  async decide(id: string, decision: 'approve' | 'reject', actorId: string) {
    const approval = await this.getApproval(id);
    if (!approval) return null;
    (approval as any).status = decision === 'approve' ? 'approved' : 'rejected';
    (approval as any).actorId = actorId;
    (approval as any).decidedAt = new Date();
    return this.approvalsRepo.save(approval);
  }
}
