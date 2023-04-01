import React from 'react';
import { useSession } from 'next-auth/react';
import { likeMumble, dislikeMumble } from '@/services';
import { LikeButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleLikeProps = {
  id: string;
  favourite: boolean;
  quantity: number;
};

export const MumbleLike = ({ id, favourite, quantity }: MumbleLikeProps) => {
  const { data: session }: any = useSession();

  const handleLike = async (id: string) => {
    if (favourite === true) {
      try {
        await dislikeMumble({ id: id, token: session?.accessToken });
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Could not dislike mumble');
      }
    } else {
      try {
        await likeMumble({ id: id, token: session?.accessToken });
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Could not like mumble');
      }
    }
  };

  return <LikeButton favourite={favourite} quantity={quantity} onClick={() => handleLike(id)} />;
};
