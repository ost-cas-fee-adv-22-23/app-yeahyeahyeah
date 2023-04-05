import { Mumble } from '@/services';
import { FetchMumbles } from '@/types/fallback';
import { MumblePostWithShimmer } from './MumblePostWithShimmer';
import { MumblePost } from './MumblePost';
import tw from 'twin.macro';

export const RenderMumbles = (
  data: FetchMumbles[],
  session: any,
  handleDelete: (id: string) => Promise<void>,
  isReply?: boolean
) => {
  return (
    data &&
    data.map((page: any) => {
      return page.mumbles.map((mumble: Mumble) => {
        if (session?.accessToken) {
          return (
            <div key={mumble.id} css={[isReply && tw`border-t-1 border-slate-200 pt-16`]}>
              <MumblePostWithShimmer
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
            <MumblePost
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
    })
  );
};
