import React, { useEffect, useMemo } from 'react';
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
  setValidate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RenderReplies: React.FC<RenderRepliesProps> = ({ id, setValidate }) => {
  const { data: session }: any = useSession();

  const { data, isLoading, error, isValidating } = useSWR({ url: '/api/replies', id }, fetchReplies, {
    refreshInterval: 30000,
  });

  const handleDelete = (id: string) => {
    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht löschen!!', {
        autoClose: true,
        keepAfterRouteChange: false,
      });
      return;
    }
    const res = deleteMumble(id, session?.accessToken);
    console.log('res', res);
  };

  useEffect(() => {
    setValidate(isValidating);
  }, [isValidating, setValidate]);

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
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
      )}
    </>
  );
};
