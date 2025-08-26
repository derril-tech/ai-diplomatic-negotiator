import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Party } from './party.entity';
import { Issue } from './issue.entity';

export enum NegotiationStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('negotiations')
export class Negotiation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: NegotiationStatus,
    default: NegotiationStatus.DRAFT
  })
  status: NegotiationStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  scheduledStartAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledEndAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndAt: Date;

  @Column({ default: 0 })
  currentRound: number;

  @Column({ default: 5 })
  maxRounds: number;

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    allowSideConversations: boolean;
    requireApproval: boolean;
    autoAdvance: boolean;
    timeLimitPerRound: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.negotiations)
  createdBy: User;

  @ManyToMany(() => Party)
  @JoinTable({
    name: 'negotiation_parties',
    joinColumn: { name: 'negotiation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'party_id', referencedColumnName: 'id' }
  })
  parties: Party[];

  @ManyToMany(() => Issue)
  @JoinTable({
    name: 'negotiation_issues',
    joinColumn: { name: 'negotiation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'issue_id', referencedColumnName: 'id' }
  })
  issues: Issue[];

  @OneToMany('Round', 'negotiation')
  rounds: any[];

  @OneToMany('Offer', 'negotiation')
  offers: any[];

  @OneToMany('Optimization', 'negotiation')
  optimizations: any[];

  @OneToMany('RiskAssessment', 'negotiation')
  riskAssessments: any[];

  @OneToMany('Export', 'negotiation')
  exports: any[];

  @OneToMany('Approval', 'negotiation')
  approvals: any[];
}
