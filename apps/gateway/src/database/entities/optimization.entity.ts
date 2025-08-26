import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Negotiation } from './negotiation.entity';

export enum OptimizationType {
  NASH = 'nash',
  KALAI_SMORODINSKY = 'kalai_smorodinsky',
  WEIGHTED_SOCIAL_WELFARE = 'weighted_social_welfare',
  PARETO_FRONTIER = 'pareto_frontier'
}

export enum OptimizationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

@Entity('optimizations')
export class Optimization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  negotiationId: string;

  @Column({
    type: 'enum',
    enum: OptimizationType,
    default: OptimizationType.PARETO_FRONTIER
  })
  type: OptimizationType;

  @Column({
    type: 'enum',
    enum: OptimizationStatus,
    default: OptimizationStatus.PENDING
  })
  status: OptimizationStatus;

  @Column({ type: 'jsonb', nullable: true })
  parameters: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  results: {
    paretoPoints: Array<{
      utilities: Record<string, number>;
      terms: Record<string, any>;
      efficiency: number;
    }>;
    zopa: {
      exists: boolean;
      region: Record<string, any>;
      volume: number;
    };
    nashSolution?: {
      utilities: Record<string, number>;
      terms: Record<string, any>;
    };
    kalaiSolution?: {
      utilities: Record<string, number>;
      terms: Record<string, any>;
    };
  };

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('Negotiation', 'optimizations')
  negotiation: any;

  @OneToMany('ParetoPoint', 'optimization')
  paretoPoints: any[];
}
