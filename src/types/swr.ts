import { FetchMumbles } from './fallback';

export type MumbleFetcher = (params: {
  url: string;
  id?: string;
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
  token?: any;
  creator?: string;
  hashtag?: string;
}) => Promise<FetchMumbles>;
