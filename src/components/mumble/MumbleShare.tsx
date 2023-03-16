import React from 'react';
import { ShareButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleShareProps = {
  id: string;
};

export const MumbleShare = ({ id }: MumbleShareProps) => {
  const directory = 'mumble';

  const handleShareLink = async () => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(`${window.location.href}${directory}/${id}`);
    }
  };
  return <ShareButton label="Copy link" onClick={handleShareLink} />;
};
