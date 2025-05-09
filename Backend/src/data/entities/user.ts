// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRepository } from './userRepository';

@Entity({name: 'user'})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  githubId!: number;

  @Column({nullable: true})
  email?: string;

  @Column({nullable: true})
  firstName?: string;

  @Column({nullable: true})
  lastName?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  @OneToMany(() => UserRepository, ur => ur.user)
  userRepositories!: UserRepository[];
}
