import React from 'react';
import tw from 'twin.macro';
import { FetchMumbles } from '@/types/fallback';
import { Button, Container, Heading } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { WelcomeText, TextBoxComponent, Alert, LoadingSpinner, ErrorBox, MumbleList, Hashtag } from '@/components';
import { useStream } from '@/hooks/useStream';
import { MumbleFetcher } from '@/types/swr';

type StreamProps = {
  url: string;
  limit: number;
  fallback: FetchMumbles;
  fetcher: MumbleFetcher;
  id?: string;
  hashtag?: string;
  creator?: { id: string };
};

export const Stream: React.FC<StreamProps> = ({ limit, fallback, hashtag, fetcher, creator, url, id }) => {
  const [
    data,
    mutate,
    error,
    isValidating,
    isLoading,
    checkForNewMumbles,
    handleDelete,
    quantityNewMumbles,
    handleRefreshPage,
    ref,
    renderTimeline,
  ] = useStream(url, limit, fallback, fetcher, id, hashtag, creator);

  const renderMumbles = (isReply?: boolean) => {
    return (
      <>
        {data && <MumbleList data={data} handleDelete={handleDelete} isReply={isReply} />}
        <div key="last" tw="invisible" ref={ref} />
        <div tw="h-16 mb-32">{(isLoading || isValidating) && <LoadingSpinner />}</div>
      </>
    );
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <>
      {renderTimeline ? (
        <>
          {!hashtag && checkForNewMumbles && (
            <MumbleMessageBox>
              <Button label={quantityNewMumbles} color="gradient" onClick={handleRefreshPage} size="small" width="full" />
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
                  <Hashtag size="xlarge" hashtag={hashtag} />
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
