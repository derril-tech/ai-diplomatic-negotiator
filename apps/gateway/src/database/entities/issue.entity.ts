import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum IssueType {
  DISTRIBUTIVE = 'distributive',
  INTEGRATIVE = 'integrative',
  LINKED = 'linked'
}

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: IssueType,
    default: IssueType.DISTRIBUTIVE
  })
  type: IssueType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  maxValue: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'jsonb', nullable: true })
  constraints: {
    redLines: string[];
    mustHaves: string[];
    niceToHaves: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany('PartyIssuePreference', 'issue')
  partyPreferences: any[];
}
