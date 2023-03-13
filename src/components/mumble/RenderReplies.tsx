import React, { useEffect } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { Mumble } from '@/services/qwacker';
import { MumblePost } from './MumblePost';
import { ErrorBox } from '../error/ErrorBox';
import { fetchReplies } from '@/services/fetchReplies';
import { useSession } from 'next-auth/react';
import { alertService } from '@/services';
import { deleteMumble } from '@/services/deleteMumble';

type RenderRepliesProps = {
  data: { replies: Mumble[]; count: number };
  mutate: KeyedMutator<{
    count: number;
    replies: {
      createdTimestamp: number;
      text: string;
      id: string;
      creator: string;
      mediaUrl: string;
      likeCount: number;
      likedByUser: boolean;
      replyCount: number;
      type: string;
      mediaType: string;
    }[];
  }>;
  error: any;
  isLoading: boolean;
};

export const RenderReplies: React.FC<RenderRepliesProps> = ({ data, mutate, error, isLoading }) => {
  const { data: session }: any = useSession();

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht löschen!!', {
        autoClose: true,
        keepAfterRouteChange: false,
      });
      return;
    }
    const res = await deleteMumble(id, session?.accessToken);

    // TODO: Is this a magic number ?
    if (res.status === 204) {
      const newData = data.replies.filter((mumble: Mumble) => mumble.id !== id);
      data.replies = newData;

      mutate({ ...data });
    }
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {data &&
        data.replies.map((mumble: any) => (
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
        ))}
    </>
  );
};
