import { Mumble } from '@/services';

export type FetchMumbles = { count: number; mumbles: Mumble[] };
export type FetchSingleMumble = Mumble;
export type FetchReplies = { count: number; replies: Mumble[] };
