import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Negotiation } from './negotiation.entity';

export enum RiskAssessmentStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('risk_assessments')
export class RiskAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  negotiationId: string;

  @Column({
    type: 'enum',
    enum: RiskAssessmentStatus,
    default: RiskAssessmentStatus.PENDING
  })
  status: RiskAssessmentStatus;

  @Column({ type: 'jsonb', nullable: true })
  riskTree: {
    nodes: Array<{
      id: string;
      name: string;
      description: string;
      probability: number;
      impact: number;
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
      children: string[];
    }>;
    rootNodeId: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  scenarios: {
    baseline: Record<string, any>;
    optimistic: Record<string, any>;
    adverse: Record<string, any>;
  };

  @Column({ type: 'jsonb', nullable: true })
  tornadoAnalysis: {
    variables: Array<{
      name: string;
      baseline: number;
      optimistic: number;
      adverse: number;
      sensitivity: number;
    }>;
  };

  @Column({ type: 'jsonb', nullable: true })
  recommendations: string[];

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Negotiation', 'riskAssessments')
  negotiation: any;

  @OneToMany('RiskOutcome', 'riskAssessment')
  outcomes: any[];
}
