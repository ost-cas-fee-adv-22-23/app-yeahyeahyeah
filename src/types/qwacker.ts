import { decodeTime } from 'ulid';

export type UploadImage = File & { preview: string };

export type Mumble = {
  id: string;
  creator: string;
  text: string;
  mediaUrl: string | null;
  mediaType: string | null;
  likeCount: number;
  likedByUser: boolean;
  type: string;
  replyCount?: number;
  parentId?: string;
  createdTimestamp: number;
};

export type Reply = Mumble;

export type User = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

export type RawMumble = Omit<Mumble, 'createdTimestamp'>;

export type RawReply = Omit<Reply, 'createdTimestamp'>;

export type QwackerReplyResponse = {
  count: number;
  mumbles: Reply[];
};

export type QwackerMumbleResponse = {
  count: number;
  data: RawMumble[];
};

export type QwackerSingleMumbleResponse = {
  data: RawMumble;
};

export type QwackerUserResponse = {
  count: number;
  data: User[];
};

export const transformMumble = (mumble: RawMumble) => ({
  ...mumble,
  createdTimestamp: decodeTime(mumble.id),
});

export const transformSingleMumble = (mumble: RawMumble) => ({
  ...mumble,
  createdTimestamp: decodeTime(mumble.id),
});
