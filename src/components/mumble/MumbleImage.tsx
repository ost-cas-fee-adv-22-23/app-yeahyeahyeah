import Image from 'next/legacy/image';
import { imageLoader } from '@/utils';
import { ImageContainer } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleImageProps = {
  mediaUrl: string;
  text: string;
  width: number;
  height: number;
};

export const MumbleImage = ({ mediaUrl, text, width, height }: MumbleImageProps) => {
  return (
    <ImageContainer
      type="container"
      loader={imageLoader}
      src={mediaUrl}
      alt={text}
      width={width}
      height={height}
      objectFit="cover"
      loading="lazy"
      placeholder="empty"
      onImageIconClick={() => console.log('ImageContainer clicked')}
      imageComponent={Image}
    />
  );
};
