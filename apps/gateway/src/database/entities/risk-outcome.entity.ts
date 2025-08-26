import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { RiskAssessment } from './risk-assessment.entity';

@Entity('risk_outcomes')
export class RiskOutcome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riskAssessmentId: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  probability: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  impact: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  expectedValue: number;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  })
  riskLevel: string;

  @Column({ type: 'jsonb', nullable: true })
  mitigationStrategies: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne('RiskAssessment', 'outcomes')
  riskAssessment: any;
}
