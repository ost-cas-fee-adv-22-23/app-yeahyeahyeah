import { Mumble } from '@/services';
import { FetchMumbles } from '@/types/fallback';
import { PostWithShimmer } from './PostWithShimmer';
import { Post } from './Post';
import tw from 'twin.macro';
import { useSession } from 'next-auth/react';

type MumbleListProps = {
  data: FetchMumbles[];
  handleDelete: (id: string) => Promise<void>;
  isReply?: boolean;
};

export const MumbleList: React.FC<MumbleListProps> = ({ data, handleDelete, isReply = false }) => {
  const { data: session }: any = useSession();

  return (
    <>
      {data &&
        data.map((page: any) => {
          return page.mumbles.map((mumble: Mumble) => {
            if (session?.accessToken) {
              return (
                <div key={mumble.id} css={[isReply && tw`border-t-1 border-slate-200 pt-16`]}>
                  <PostWithShimmer
                    key={mumble.id}
                    id={mumble.id}
                    creator={mumble.creator}
                    text={mumble.text}
                    mediaUrl={mumble.mediaUrl}
                    createdTimestamp={mumble.createdTimestamp}
                    likeCount={mumble.likeCount}
                    likedByUser={mumble.likedByUser}
                    replyCount={mumble.replyCount}
                    type={mumble.type}
                    mediaType={mumble.mediaType}
                    handleDeleteCallback={handleDelete}
                  />
                </div>
              );
            }
            return (
              <div key={mumble.id} css={[isReply && tw`border-t-1 border-slate-200 pt-16`]}>
                <Post
                  key={mumble.id}
                  id={mumble.id}
                  creator={mumble.creator}
                  text={mumble.text}
                  mediaUrl={mumble.mediaUrl}
                  createdTimestamp={mumble.createdTimestamp}
                  likeCount={mumble.likeCount}
                  likedByUser={mumble.likedByUser}
                  replyCount={mumble.replyCount}
                  type={mumble.type}
                  mediaType={mumble.mediaType}
                  handleDeleteCallback={handleDelete}
                />
              </div>
            );
          });
        })}
    </>
  );
};
