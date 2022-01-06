// Wonderfully hardcoded things.
export const CLIENT_ID: string = '471811409886314496';
export const SUPPORT_URL = 'https://discord.gg/2fEpJTWzAU';
export const AVATAR_URL =
  'https://cdn.discordapp.com/avatars/471811409886314496/e46c68a64b88316435adf4e1ac0402d0.webp?size=2048';
export const VOTE_URL = `https://top.gg/bot/${CLIENT_ID}/vote`;

// .env stuff
export const TOKEN: string = process.env.TOKEN || '';
export const DB_NAME = process.env.DB_NAME || 'rolebotBeta';
export const POSTGRES_URL = `${process.env.POSTGRES_URL}${DB_NAME}` || '';
export const SHARD_COUNT = Number(process.env.SHARD_COUNT) || 3;
// Only sync when in dev
export const SYNC_DB = Boolean(Number(process.env.SYNC_DB)) || false;
