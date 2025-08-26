import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Negotiation } from './negotiation.entity';

export enum RoundStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('rounds')
export class Round {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  negotiationId: string;

  @Column()
  roundNumber: number;

  @Column({
    type: 'enum',
    enum: RoundStatus,
    default: RoundStatus.PLANNED
  })
  status: RoundStatus;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  scheduledStartAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledEndAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  agenda: string[];

  @Column({ type: 'jsonb', nullable: true })
  outcomes: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Negotiation', 'rounds')
  negotiation: any;

  @OneToMany('TranscriptEntry', 'round')
  transcriptEntries: any[];
}
