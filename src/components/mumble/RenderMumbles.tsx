import { Mumble } from '@/services';
import { FetchMumbles } from '@/types/fallback';
import { MumblePostWithShimmer } from './MumblePostWithShimmer';
import { MumblePost } from './MumblePost';

export const RenderMumbles = (data: FetchMumbles[], session: any, handleDelete: (id: string) => Promise<void>) => {
  return (
    data &&
    data.map((page: any) => {
      return page.mumbles.map((mumble: Mumble) => {
        if (session?.accessToken) {
          return (
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
          );
        }
        return (
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
            handleDeleteCallback={handleDelete}
          />
        );
      });
    })
  );
};
