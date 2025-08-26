import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Offer } from './offer.entity';
import { Party } from './party.entity';

@Entity('offer_evaluations')
export class OfferEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  offerId: string;

  @Column()
  evaluatedById: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  utility: number;

  @Column({ type: 'jsonb' })
  issueEvaluations: Record<string, {
    utility: number;
    comments: string;
    redLineHits: string[];
  }>;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'jsonb', nullable: true })
  concerns: string[];

  @Column({ type: 'jsonb', nullable: true })
  suggestions: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Offer', 'evaluations')
  offer: any;

  @ManyToOne('Party')
  evaluatedBy: Party;
}
