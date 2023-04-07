import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Hashtag } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { Mumble, searchMumbles } from '@/services';
import { useSession } from 'next-auth/react';

type HashtagSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

type MumbleHashtagProps = {
  size: HashtagSize;
  hashtag: string;
};

export const MumbleHashtag: React.FC<MumbleHashtagProps> = ({ size, hashtag }) => {
  const { data: session }: any = useSession();

  const { data: hashtagData } = useSWR(
    { url: '/api/mumbles', limit: 10, offset: 0, text: '#', token: session?.accessToken },
    searchMumbles,
    {
      refreshInterval: 10000,
    }
  );

  return <>{hashtagData && hashtagData.mumbles.map((mumble: Mumble) => renderHashtags(mumble.text, size, hashtag))}</>;
};

export const renderHashtags = (text: string, size: HashtagSize, hashtag?: string) => {
  const color = (str: string) => {
    if (hashtag) return str.replace('#', '') === hashtag ? 'violet' : 'slate-300';
    return 'violet';
  };

  return text.split(' ').map((str, i) => {
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
};
