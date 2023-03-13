import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { LikeButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { likeMumble, dislikeMumble } from '@/services';

type MumbleLikeProps = {
  id: string;
  favourite: boolean;
  quantity: number;
};

export const MumbleLike = ({ id, favourite, quantity }: MumbleLikeProps) => {
  const { data: session }: any = useSession();
  const [liked, setLiked] = useState<boolean>(favourite);

  const handleLike = async (id: string) => {
    if (liked === true) {
      await dislikeMumble({ id: id, token: session?.accessToken });
      setLiked(false);
    } else {
      await likeMumble({ id: id, token: session?.accessToken });
      setLiked(true);
    }
  };

  return <LikeButton favourite={favourite} quantity={quantity} onClick={() => handleLike(id)} />;
};
