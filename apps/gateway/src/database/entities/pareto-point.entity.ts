import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Optimization } from './optimization.entity';

@Entity('pareto_points')
export class ParetoPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  optimizationId: string;

  @Column({ type: 'jsonb' })
  utilities: Record<string, number>;

  @Column({ type: 'jsonb' })
  terms: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  efficiency: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne('Optimization', 'paretoPoints')
  optimization: any;
}
