import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { fetchMumbles } from '@/services/fetchMumbles';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, RenderMumbles, MumblePost, Alert } from '@/components';
import debounce from 'lodash.debounce';
import useOnScreen from '@/hooks/useOnScreen';
import { Mumble } from '@/services/qwacker';

const quantity = 2;

export default function Page() {
  const [count, setCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [quantityTotal, setQuantityTotal] = useState(0);
  const ref = useRef(null);
  const { isOnScreen, setIsOnScreen } = useOnScreen(ref);
  const [post, setPost] = useState<Mumble | null>(null);

  const { data, isLoading, isValidating } = useSWR({ url: '/api/mumbles', limit: quantity, offset: 0 }, fetchMumbles, {
    refreshInterval: 20000,
  });

  useEffect(() => {
    data && data.count > 0 && setQuantityTotal(data.count);
  }, [data]);

  useEffect(() => {
    setPost(null);
  }, [isLoading, isValidating]);

  const handleIntersectionCallback = () => {
    setOffset((offset) => offset + quantity);
    setCount((count) => count + 1);
    setIsOnScreen(false);
  };

  const handleIntersectionCallbackDebounced = debounce(async () => {
    handleIntersectionCallback();
  }, 800);

  useEffect(() => {
    if (isOnScreen && quantityTotal - quantity * 2 >= offset) handleIntersectionCallbackDebounced();
  }, [handleIntersectionCallbackDebounced, isOnScreen, quantityTotal, offset]);

  const pages: any = [];

  for (let i = 0; i < count; i++) {
    pages.push(<RenderMumbles key={i} offset={offset} limit={quantity} />);
  }

  return (
    <Container layout="plain">
      <WelcomeText />
      <Container layout="plain">
        <Alert />
      </Container>
      <TextBoxComponent variant="write" setPost={setPost} />

      {post && (
        <MumblePost
          key={post.id}
          id={post.id}
          creator={post.creator}
          text={post.text}
          mediaUrl={post.mediaUrl}
          createdTimestamp={post.createdTimestamp}
          likeCount={post.likeCount}
          likedByUser={post.likedByUser}
          replyCount={post.replyCount}
          type={post.type}
        />
      )}

      {pages}

      <div key="last" tw="invisible" ref={ref} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({ req }: GetServerSidePropsContext) => {
  const fetch = await fetchMumbles({ limit: quantity });

  console.log(fetch);

  return {
    props: {
      fallback: {
        '/api/mumbles': fetch,
      },
    },
  };
};
