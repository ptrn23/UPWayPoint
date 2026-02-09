import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';
import * as dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? '***loaded***' : 'NOT FOUND');
migrate(db, { migrationsFolder: 'drizzle' })
  .then(() => {
    console.log('migrations finished!');
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });