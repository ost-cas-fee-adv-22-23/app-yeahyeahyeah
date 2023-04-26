import React from 'react';
import { useSession } from 'next-auth/react';
import Message from '../../../data/content.json';
import { likeMumble, dislikeMumble } from '@/services';
import { LikeButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type LikeProps = {
  id: string;
  favourite: boolean;
  quantity: number;
};

export const Like: React.FC<LikeProps> = ({ id, favourite, quantity }) => {
  const { data: session }: any = useSession();

  const handleLike = async (id: string) => {
    if (favourite === true) {
      try {
        await dislikeMumble({ id: id, token: session?.accessToken });
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : `${Message.alerts.dislikeError.text}`);
      }
    } else {
      try {
        await likeMumble({ id: id, token: session?.accessToken });
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : `${Message.alerts.likeError.text}`);
      }
    }
  };

  return <LikeButton favourite={favourite} quantity={quantity} onClick={() => handleLike(id)} />;
};
