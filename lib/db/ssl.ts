import { PoolConfig } from 'pg';

export function getSslConfig(): PoolConfig['ssl'] {
  // Always use SSL for Neon DB
  if (process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('neon.tech') || process.env.DATABASE_URL.includes('sslmode=require'))) {
    return {
      rejectUnauthorized: false,
    };
  }
  return undefined;
}
