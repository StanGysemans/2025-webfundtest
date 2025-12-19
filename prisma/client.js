import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file.');
}

const prisma = new PrismaClient();
export default prisma;

