import React, { useEffect, useRef } from 'react';
import tw from 'twin.macro';
import debounce from 'lodash.debounce';
import { useSession } from 'next-auth/react';
import useOnScreen from '@/hooks/useOnScreen';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { FetchMumbles } from '@/types/fallback';
import { alertService, deleteMumble } from '@/services';
import { Button, Container, Heading } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, Alert, LoadingSpinner, ErrorBox, RenderMumbles, MumbleHashtag } from '@/components';

type StreamProps = {
  url: string;
  limit: number;
  fallback: FetchMumbles;
  fetcher: (params: {
    url: string;
    id?: string;
    limit?: number;
    offset?: number;
    newerThanMumbleId?: string;
    token?: any;
    creator?: string;
    hashtag?: string;
  }) => Promise<FetchMumbles>;
  id?: string;
  hashtag?: string;
  creator?: { id: string };
};

export const Stream: React.FC<StreamProps> = ({ limit, fallback, hashtag, fetcher, creator, url, id }) => {
  const { data: session }: any = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const [isOnScreen, setIsOnScreen] = useOnScreen(ref);

  const getKey = (pageIndex: number, previousPageData: FetchMumbles) => {
    if (previousPageData && !previousPageData.mumbles.length) {
      return null;
    }

    return {
      id,
      url,
      limit,
      offset: pageIndex * limit,
      token: session?.accessToken,
      tags: [hashtag],
      creator: creator?.id,
    };
  };

  const { data, mutate, size, setSize, error, isValidating, isLoading } = useSWRInfinite(getKey, fetcher, {
    fallbackData: [fallback],
    revalidateOnFocus: false,
    refreshInterval: 60000,
    parallel: true,
  });

  const { data: newMumbles } = useSWR(
    {
      url: '/api/mumbles',
      newerThanMumbleId: data && data[0]?.mumbles[0]?.id,
      limit,
      offset: 0,
      token: session?.accessToken,
    },
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 10000,
    }
  );

  const handleIntersectionCallbackDebounced = debounce(async () => {
    setSize(size + 1);
    setIsOnScreen(false);
  }, 800);

  useEffect(() => {
    // TODO: id is needed on profile page, because there is no possibility for setting offset and limit on endpoint
    if (!id && isOnScreen && !isValidating && data && data.length * limit <= data[0].count)
      handleIntersectionCallbackDebounced();
  });

  const checkForNewMumbles = () => {
    return data && data[0]?.mumbles[0]?.id && newMumbles && newMumbles.count > 0;
  };

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht löschen!!', {
        autoClose: true,
        keepAfterRouteChange: false,
      });
      return;
    }
    const res = await deleteMumble(id, session?.accessToken);

    //TODO: Is this a magic number ?
    if (res.status === 204) {
      mutate();
    }
  };

  const quantityNewMumbles = () => {
    return data && data[0]?.mumbles[0].id && newMumbles && newMumbles.count === 1
      ? '1 neuer Mumble'
      : `${newMumbles && newMumbles.count} neue Mumbles`;
  };

  const handleRefreshPage = () => {
    mutate();
    window.scrollTo(0, 0);
  };

  const renderMumbles = (isReply?: boolean) => {
    return (
      <>
        {data && <RenderMumbles data={data} handleDelete={handleDelete} isReply={isReply} />}
        <div key="last" tw="invisible" ref={ref} />
        <div tw="h-16 mb-32">{(isLoading || isValidating) && <LoadingSpinner />}</div>
      </>
    );
  };

  const renderTimeline = () => !creator && !id;

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      {renderTimeline() ? (
        <>
          {!hashtag && checkForNewMumbles() && (
            <MumbleMessageBox>
              <Button label={quantityNewMumbles()} color="gradient" onClick={handleRefreshPage} size="small" width="full" />
            </MumbleMessageBox>
          )}
          <Container layout="plain">
            {!hashtag && !creator && (
              <>
                <WelcomeText />
                <Alert />
                <TextBoxComponent variant="write" mutate={mutate} data={data} />
              </>
            )}
            {hashtag && (
              <>
                <div tw="mb-16 mx-16">
                  <Heading label="Latest Hashtags..." color="violet" tag="h1" size="default" mbSpacing="8" />
                  <Heading label="...used by other users" color="light" tag="h2" size="xlarge" mbSpacing="32" />
                </div>
                <div tw="flex flex-wrap bg-slate-white transform duration-500 bg-slate-100 rounded-xl p-16 sm:p-32 mb-32 gap-8 min-h-[280px]">
                  <MumbleHashtag size="xlarge" hashtag={hashtag} />
                </div>
              </>
            )}

            {renderMumbles()}
          </Container>
        </>
      ) : (
        <>
          {id ? (
            <>
              <TextBoxComponent id={id} variant="write" mutate={mutate} data={data} />
              {renderMumbles(true)}
            </>
          ) : (
            renderMumbles()
          )}
        </>
      )}
    </>
  );
};

const MumbleMessageBox = tw.div`animate-bounce fixed top-[110px] mx-auto z-50 hover:(animate-none)`;
