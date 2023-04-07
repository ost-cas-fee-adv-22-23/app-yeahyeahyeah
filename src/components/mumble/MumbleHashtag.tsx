import { Hashtag } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import Link from 'next/link';
import React from 'react';

type MumbleHashtagProps = {
  text: string;
  size: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  hashtag?: string;
};

export const MumbleHashtag: React.FC<MumbleHashtagProps> = ({ text, size, hashtag }) => {
  const color = (str: string) => {
    if (hashtag) return str.replace('#', '') === hashtag ? 'violet' : 'slate-300';
    return 'violet';
  };

  const renderHashtags = text.split(' ').map((str, i) => {
    if (str.startsWith('#')) {
      return (
        <React.Fragment key={i}>
          <Hashtag
            label={str.replace('#', '')}
            size={size}
            color={color(str)}
            linkComponent={Link}
            href={`/search/${str.replace('#', '')}`}
            legacyBehavior
            passHref
          />{' '}
        </React.Fragment>
      );
    }
    if (hashtag) return ' ';
    return str + ' ';
  });

  return <>{renderHashtags}</>;
};
