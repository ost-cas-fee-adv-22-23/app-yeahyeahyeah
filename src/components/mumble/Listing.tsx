import { Mumble, QwackerUserResponse } from '@/services';
import { FetchMumbles } from '@/types/fallback';
import { PostWithShimmer } from './PostWithShimmer';
import { Post } from './Post';
import { useSession } from 'next-auth/react';

type ListingProps = {
  data: FetchMumbles[];
  handleDelete: (id: string) => Promise<void>;
  isReply?: boolean;
  fallbackUsers?: QwackerUserResponse;
};

export const Listing: React.FC<ListingProps> = ({ data, handleDelete, isReply = false, fallbackUsers }) => {
  const { data: session }: any = useSession();

  return (
    <>
      {data &&
        data.map((page: any) => {
          return page.mumbles.map((mumble: Mumble) => {
            if (session?.accessToken) {
              return (
                <PostWithShimmer
                  key={mumble.id}
                  id={mumble.id}
                  $isReply={isReply}
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
                  fallbackUsers={fallbackUsers}
                />
              );
            }
            return (
              <Post
                key={mumble.id}
                id={mumble.id}
                $isReply={isReply}
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
                fallbackUsers={fallbackUsers}
              />
            );
          });
        })}
    </>
  );
};
