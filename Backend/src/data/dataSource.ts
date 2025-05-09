import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Repository } from './entities/repository';
import { UserRepository } from './entities/userRepository';
import { User } from './entities/user';
import secrets from '../config/secrets';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: secrets.DB_HOST,
  port: secrets.DB_PORT,
  username: secrets.DB_USERNAME,
  password: secrets.DB_PASSWORD,
  database: secrets.DB_DATABASE,
  synchronize: true, // set to false in production
  logging: false,
  entities: [Repository, User, UserRepository],
  migrationsTableName: 'migrations',
  migrations: [path.normalize(__dirname + '/migrations/*.ts')],
  subscribers: [],
}); 

export const initDB = async () => {
  try {
    await AppDataSource.initialize() // Initialize the DataSource
    console.log('Database connection established')
  } catch (err) {
    console.error('Error during Data Source initialization:', err)
    throw err
  }
}