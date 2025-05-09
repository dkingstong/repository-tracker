// user-repository.entity.ts
import { Entity, ManyToOne, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Repository } from './repository';

@Entity({name: 'user_repository'})
export class UserRepository {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @PrimaryColumn({ type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ type: 'uuid' })
  repositoryId!: string;

  @Column({ type: 'boolean', default: false })
  seen!: boolean;

  @ManyToOne(() => User, user => user.userRepositories, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Repository, repo => repo.userRepositories, { onDelete: 'CASCADE' })
  repository!: Repository;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date
}
