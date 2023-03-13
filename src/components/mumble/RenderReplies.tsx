import React, { useEffect } from 'react';
import useSWR from 'swr';
import { Mumble } from '@/services/qwacker';
import { MumblePost } from './MumblePost';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { ErrorBox } from '../error/ErrorBox';
import { fetchReplies } from '@/services/fetchReplies';
import { useSession } from 'next-auth/react';
import { alertService } from '@/services';
import { deleteMumble } from '@/services/deleteMumble';

type RenderRepliesProps = {
  id: string;
  fallback?: any;
};

export const RenderReplies: React.FC<RenderRepliesProps> = ({ id, fallback }) => {
  const { data: session }: any = useSession();

  const { data, error } = useSWR({ url: '/api/replies', id }, fetchReplies, {
    refreshInterval: 2000,
    fallbackData: fallback['/api/replies'],
  });

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht löschen!!', {
        autoClose: true,
        keepAfterRouteChange: false,
      });
      return;
    }
    const res = await deleteMumble(id, session?.accessToken);
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <>
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
