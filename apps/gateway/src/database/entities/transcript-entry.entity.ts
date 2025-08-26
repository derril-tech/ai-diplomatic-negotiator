import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Round } from './round.entity';
import { Party } from './party.entity';

export enum TranscriptEntryType {
  SPEECH = 'speech',
  OFFER = 'offer',
  EVALUATION = 'evaluation',
  MEDIATOR_NOTE = 'mediator_note',
  SYSTEM_EVENT = 'system_event'
}

@Entity('transcript_entries')
export class TranscriptEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roundId: string;

  @Column({ nullable: true })
  partyId: string;

  @Column({
    type: 'enum',
    enum: TranscriptEntryType,
    default: TranscriptEntryType.SPEECH
  })
  type: TranscriptEntryType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    isPrivate: boolean;
    isCaucus: boolean;
    offerId?: string;
    evaluationId?: string;
    [key: string]: any;
  };

  @Column({ type: 'integer', default: 0 })
  sequenceNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne('Round', 'transcriptEntries')
  round: any;

  @ManyToOne('Party')
  party: Party;
}
