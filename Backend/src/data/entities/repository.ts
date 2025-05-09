// repository.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { UserRepository } from './userRepository';

@Entity({ name: 'repository' })
@Unique(['owner', 'name']) // Composite unique constraint

export class Repository {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  githubRepoId!: number; 

  @Column()
  owner!: string;

  @Column()
  name!: string;

  @Column()
  latestReleaseDescription!: string;

  @Column()
  latestReleaseVersion!: string;

  @Column()
  latestReleaseDate!: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  @OneToMany(() => UserRepository, ur => ur.repository)
  userRepositories!: UserRepository[];
}
