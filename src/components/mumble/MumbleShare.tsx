import React from 'react';
import { ShareButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleShareProps = {
  path?: string;
};

export const MumbleShare = ({ id, path }: MumbleShareProps) => {
  const handleShareLink = async () => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(`${path}`);
    }
  };
  return <ShareButton label="Copy link" onClick={handleShareLink} />;
};
