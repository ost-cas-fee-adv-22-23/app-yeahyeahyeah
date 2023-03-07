import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { Mumble } from 'services/qwacker';
import { fetchMumbles } from '../../services/fetchMumbles';
import { Button, Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { MumblePost, WelcomeText, TextBoxComponent } from '@/components';

const getKey = (pageIndex: number, previousPageData: any) => {
  console.log('pageIndex', pageIndex);
  console.log('previousPageData', previousPageData);

  if (previousPageData && !previousPageData.mumbles.length) {
    return null;
  }

  return { url: '/api/mumbles', limit: 2, offset: pageIndex * 2 };
};

export default function Page() {
  const [hasMore, setHasMore] = useState(true);

  const { data, error, isLoading: loading, size, setSize } = useSWRInfinite(getKey, fetchMumbles);

  if (!data) return 'loading';

  console.log('data', data);

  return (
    <Container layout="plain">
      <WelcomeText />
      <TextBoxComponent variant="write" />

      {data.map((page) => {
        return page.mumbles.map((mumble: Mumble) => (
          <MumblePost
            key={mumble.id}
            id={mumble.id}
            creator={mumble.creator}
            text={mumble.text}
            mediaUrl={mumble.mediaUrl}
            createdTimestamp={mumble.createdTimestamp}
            likeCount={mumble.likeCount}
            likedByUser={mumble.likedByUser}
            replyCount={mumble.replyCount}
          />
        ));
      })}

      <Button onClick={() => setSize(size + 1)} disabled={loading} color="violet" label={loading ? '...' : 'Load more'} />
    </Container>
  );
}
export const getServerSideProps: GetServerSideProps<any> = async ({ req }: GetServerSidePropsContext) => {
  const fetch = await fetchMumbles({ limit: 2 });

  console.log(fetch);

  return {
    props: {
      fallback: {
        '/api/mumbles': fetch,
      },
    },
  };
};
