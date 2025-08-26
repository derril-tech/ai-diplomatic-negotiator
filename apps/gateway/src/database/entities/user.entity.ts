import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEDIATOR = 'mediator',
  DELEGATE = 'delegate',
  ANALYST = 'analyst',
  OBSERVER = 'observer'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ nullable: true })
  country: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OBSERVER
  })
  role: UserRole;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Exclude()
  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany('Negotiation', 'createdBy')
  negotiations: any[];

  @OneToMany('Party', 'user')
  parties: any[];
}
