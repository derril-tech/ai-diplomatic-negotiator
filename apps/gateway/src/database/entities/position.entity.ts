import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Party } from './party.entity';

export enum PositionType {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  partyId: string;

  @Column({
    type: 'enum',
    enum: PositionType,
    default: PositionType.PUBLIC
  })
  type: PositionType;

  @Column({ type: 'text' })
  stance: string;

  @Column({ type: 'jsonb' })
  interests: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  arguments: string[];

  @Column({ type: 'jsonb', nullable: true })
  evidence: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Party', 'positions')
  party: Party;
}
