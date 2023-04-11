import { KeyedMutator } from 'swr';
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

export type StreamHook = [
  data: FetchMumbles[],
  mutate: KeyedMutator<FetchMumbles[]>,
  error: any,
  isValidating: boolean,
  isLoading: boolean,
  checkForNewMumbles: boolean,
  quantityNewMumbles: string,
  renderTimeline: boolean,
  handleDelete: (id: string) => Promise<void>,
  handleRefreshPage: () => void,
  ref: React.RefObject<HTMLDivElement>
];
