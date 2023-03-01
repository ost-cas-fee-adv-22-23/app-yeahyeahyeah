import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Mumble } from 'services/qwacker';
import { fetchMumbles } from '../../services/fetchMumbles';
import { Button, Container, Heading } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { MumblePost, WelcomeText, TextBoxComponent } from '@/components';

type PageProps = {
  count: number;
  mumbles: Mumble[];
  error?: string;
};

export default function Page({
  count: initialCount,
  mumbles: initialMumbles,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession();
  const [mumbles, setMumbles] = useState(initialMumbles);
  const [loading, setLoading] = useState(false);
  const [count] = useState(initialCount);
  const [hasMore, setHasMore] = useState(initialMumbles.length < count);

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  const loadMore = async () => {
    const { count, mumbles: newMumbles } = await fetchMumbles({
      limit: 2,
      offset: mumbles.length,
    });

    setLoading(false);
    setHasMore(mumbles.length + newMumbles.length < count);
    setMumbles([...mumbles, ...newMumbles]);
  };

  return (
    <Container layout="plain">
      {session ? (
        <>
          <WelcomeText />
          <TextBoxComponent />

          {mumbles.map((mumble) => (
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
          ))}

          {hasMore ? (
            <Button onClick={() => loadMore()} disabled={loading} color="violet" label={loading ? '...' : 'Load more'} />
          ) : (
            ''
          )}
        </>
      ) : (
        <Heading label="Not authorized" size="default" tag="h1" alignment="center" mbSpacing="32" color="pink" />
      )}
    </Container>
  );
}
export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req }: GetServerSidePropsContext) => {
  try {
    const { count, mumbles } = await fetchMumbles({ limit: 2 });

    return { props: { count, mumbles } };
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return { props: { error: message, mumbles: [], count: 0 } };
  }
};
