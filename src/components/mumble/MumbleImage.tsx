import Image from 'next/legacy/image';
import { imageLoader } from '@/utils';
import { ImageContainer } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleImageProps = {
  mediaUrl: string;
  text: string;
};

export const MumbleImage = ({ mediaUrl, text }: MumbleImageProps) => {
  return (
    <ImageContainer
      type="container"
      loader={imageLoader}
      src={mediaUrl}
      alt={text}
      width={585}
      height={329.06}
      objectFit="cover"
      loading="lazy"
      placeholder="empty"
      onImageIconClick={() => console.log('ImageContainer clicked')}
      imageComponent={Image}
    />
  );
};
