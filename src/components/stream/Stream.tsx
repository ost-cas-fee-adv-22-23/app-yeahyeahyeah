import React from 'react';
import tw from 'twin.macro';
import { FetchMumbles } from '@/types/fallback';
import { Button, Container, Heading } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { alertService } from '@/services';
import { WelcomeText, TextBoxComponent, Alert, LoadingSpinner, Listing, Hashtag } from '@/components';
import { useStream } from '@/hooks';
import { MumbleFetcher } from '@/types/swr';

type StreamProps = {
  url: string;
  limit: number;
  fallback: FetchMumbles;
  fetcher: MumbleFetcher;
  id?: string;
  hashtag?: string;
  creator?: { id: string };
  message: string;
};

export const Stream: React.FC<StreamProps> = ({ limit, fallback, hashtag, fetcher, creator, url, id, message }) => {
  const [
    data,
    mutate,
    error,
    isValidating,
    isLoading,
    checkForNewMumbles,
    quantityNewMumbles,
    renderTimeline,
    handleDelete,
    handleRefreshPage,
    ref,
  ] = useStream(url, limit, fallback, fetcher, id, hashtag, creator);

  const renderMumbles = (isReply?: boolean) => {
    return (
      <>
        {data && <Listing data={data} handleDelete={handleDelete} isReply={isReply} />}
        <div key="last" tw="invisible" ref={ref} />
        <LoadingSpinnerWrapper>{(isLoading || isValidating) && <LoadingSpinner />}</LoadingSpinnerWrapper>
      </>
    );
  };

  if (error) {
    alertService.error(`${error}`, {
      autoClose: false,
      keepAfterRouteChange: false,
    });
    return <Alert />;
  }

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
                <TextBoxComponent variant="write" mutate={mutate} />
              </>
            )}
            {hashtag && (
              <>
                <div tw="mb-16 mx-16">
                  <Heading label="Latest Hashtags..." color="violet" tag="h1" size="default" mbSpacing="8" />
                  <Heading label="...used by other users" color="light" tag="h2" size="xlarge" mbSpacing="32" />
                </div>
                <HashTagWrapper>
                  <Hashtag size="xlarge" hashtag={hashtag} />
                </HashTagWrapper>
              </>
            )}

            {renderMumbles()}
          </Container>
        </>
      ) : (
        <>
          {id ? (
            <>
              <TextBoxComponent id={id} variant="write" mutate={mutate} />
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

const LoadingSpinnerWrapper = tw.div`h-16 mb-32`;
const MumbleMessageBox = tw.div`animate-bounce fixed top-[110px] mx-auto z-50 hover:(animate-none)`;
const HashTagWrapper = tw.div`flex flex-wrap transform duration-500 bg-slate-white rounded-xl p-16 sm:p-32 mb-32 gap-8 min-h-[280px] overflow-hidden`;
