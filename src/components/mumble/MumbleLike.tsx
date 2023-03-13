import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    setLiked(favourite);
  }, [favourite]);

  const handleLike = async (id: string) => {
    if (liked === true) {
      const res = await dislikeMumble({ id: id, token: session?.accessToken });
      console.log('res dislike', res);
      // TODO: use constant instead of magic number
      res.status === 204 && setLiked(false);
    } else {
      const res = await likeMumble({ id: id, token: session?.accessToken });
      console.log('res like', res);
      // TODO: use constant instead of magic number
      res.status === 204 && setLiked(true);
    }
  };

  return <LikeButton favourite={favourite} quantity={quantity} onClick={() => handleLike(id)} />;
};
