import React from 'react';
import process from 'process';
import { ShareButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type ShareProps = {
  id: string;
};

export const Share: React.FC<ShareProps> = ({ id }) => {
  const host = process.env.NEXT_PUBLIC_URL;
  const directory = 'mumble';

  const handleShareLink = async () => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(`${host}/${directory}/${id}`);
    }
  };
  return <ShareButton label="Copy link" onClick={handleShareLink} />;
};
