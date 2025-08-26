import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';

export enum PartyType {
  COUNTRY = 'country',
  ORGANIZATION = 'organization',
  INDIVIDUAL = 'individual'
}

@Entity('parties')
export class Party {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PartyType,
    default: PartyType.ORGANIZATION
  })
  type: PartyType;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('User', 'parties')
  user: User;

  @OneToMany('PartyIssuePreference', 'party')
  issuePreferences: any[];

  @OneToMany('Position', 'party')
  positions: any[];

  @OneToMany('Offer', 'proposedBy')
  offers: any[];
}
