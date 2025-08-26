import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Negotiation } from './negotiation.entity';
import { Party } from './party.entity';

export enum OfferStatus {
  PROPOSED = 'proposed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COUNTERED = 'countered',
  EXPIRED = 'expired'
}

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  negotiationId: string;

  @Column()
  proposedById: string;

  @Column({ nullable: true })
  roundNumber: number;

  @Column({
    type: 'enum',
    enum: OfferStatus,
    default: OfferStatus.PROPOSED
  })
  status: OfferStatus;

  @Column({ type: 'jsonb' })
  terms: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  utilities: Record<string, number>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalUtility: number;

  @Column({ type: 'text', nullable: true })
  rationale: string;

  @Column({ type: 'jsonb', nullable: true })
  conditions: string[];

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Negotiation', 'offers')
  negotiation: any;

  @ManyToOne('Party', 'offers')
  proposedBy: Party;

  @OneToMany('OfferEvaluation', 'offer')
  evaluations: any[];
}
