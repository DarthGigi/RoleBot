// Wonderfully hardcoded things.
export const OWNER_ID = "389759544776982528";
export const CLIENT_ID = process.env.CLIENT_ID || "1135638512109097130";
export const SUPPORT_URL = "https://minions.mrgigi.me/discord";
export const AVATAR_URL = "https://minions.mrgigi.me/assets/images/favicons/favicon.png";

// .env stuff
export const TOKEN: string = process.env.TOKEN || "";
export const DB_NAME = process.env.DB_NAME || "rolebotBeta";
export const POSTGRES_URL = `${process.env.POSTGRES_URL}${DB_NAME}` || "";
export const SHARD_COUNT = Number(process.env.SHARD_COUNT) || 6;
export const SERVER_ID = "1133219625497284638";
// Only sync when in dev
export const SYNC_DB = Boolean(Number(process.env.SYNC_DB)) || false;

export const TUTORIAL_PLAYLIST = "https://www.youtube.com/watch?v=ikqTW4bbM7s&list=PLW0pJjCQgtaV2ukCIV_0h56Ld2wtKyvcR";
