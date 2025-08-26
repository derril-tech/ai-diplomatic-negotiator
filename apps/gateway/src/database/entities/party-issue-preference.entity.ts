import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { Party } from './party.entity';
import { Issue } from './issue.entity';

@Entity('party_issue_preferences')
@Unique(['partyId', 'issueId'])
export class PartyIssuePreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  partyId: string;

  @Column()
  issueId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  reservationValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  targetValue: number;

  @Column({ type: 'jsonb', nullable: true })
  utilityCurve: {
    type: 'linear' | 'concave' | 'convex';
    parameters: Record<string, number>;
  };

  @Column({ type: 'jsonb', nullable: true })
  constraints: {
    redLines: string[];
    mustHaves: string[];
    niceToHaves: string[];
    batna: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Party', 'issuePreferences')
  party: Party;

  @ManyToOne('Issue', 'partyPreferences')
  issue: Issue;
}
