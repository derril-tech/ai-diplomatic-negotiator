import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Negotiation } from './negotiation.entity';
import { User } from './user.entity';

export enum ExportFormat {
  PDF = 'pdf',
  MDX = 'mdx',
  CSV = 'csv',
  JSON = 'json',
  ZIP = 'zip'
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('exports')
export class Export {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  negotiationId: string;

  @Column({ nullable: true })
  requestedById: string;

  @Column({
    type: 'enum',
    enum: ExportFormat,
    default: ExportFormat.PDF
  })
  format: ExportFormat;

  @Column({
    type: 'enum',
    enum: ExportStatus,
    default: ExportStatus.PENDING
  })
  status: ExportStatus;

  @Column({ type: 'jsonb' })
  options: {
    includeTranscript: boolean;
    includePositions: boolean;
    includeOffers: boolean;
    includeOptimizations: boolean;
    includeRiskAssessment: boolean;
    includePrecedents: boolean;
  };

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Negotiation', 'exports')
  negotiation: any;

  @ManyToOne('User')
  requestedBy: User;
}
