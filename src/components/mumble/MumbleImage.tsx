import React, { useState } from 'react';
import Image from 'next/legacy/image';
import { imageLoader } from '@/utils';
import { ImageContainer, Modal } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleImageProps = {
  mediaUrl: string;
  text: string;
  width: number;
  height: number;
};

export const MumbleImage = ({ mediaUrl, text, width, height }: MumbleImageProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <>
      {open === false && (
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
          onImageIconClick={() => handleClick()}
          imageComponent={Image}
        />
      )}
      {open === true && (
        <Modal label="Mumble Image" isOpen={open} onClose={handleClose} wide="full">
          <Image
            loader={imageLoader}
            src={mediaUrl}
            alt={text}
            width="1280"
            height="720"
            layout="intrinsic"
            objectFit="contain"
            loading="lazy"
            placeholder="empty"
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 100vw,
              100vw"
            className="w-100 h-100"
          />
        </Modal>
      )}
    </>
  );
};
