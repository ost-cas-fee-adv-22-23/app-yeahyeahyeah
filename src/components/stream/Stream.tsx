import React from 'react';
import { FetchMumbles } from '@/types/fallback';
import { useStream } from '@/hooks';
import { MumbleFetcher } from '@/types/swr';
import { Listing } from '../mumble/Listing';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { Timeline } from '../mumble/Timeline';
import { TextBoxComponent } from '../form/TextBoxComponent';
import { Alert } from '../alert/Alert';
import { QwackerUserResponse, alertService } from '@/services';

type StreamProps = {
  url: string;
  limit: number;
  fallback: FetchMumbles;
  fallbackUsers?: QwackerUserResponse;
  fetcher: MumbleFetcher;
  id?: string;
  hashtag?: string;
  creator?: { id: string };
};

export const Stream: React.FC<StreamProps> = ({ limit, fallback, hashtag, fetcher, creator, url, id, fallbackUsers }) => {
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
        {data && <Listing data={data} handleDelete={handleDelete} isReply={isReply} fallbackUsers={fallbackUsers} />}
        <div key="last" tw="invisible" ref={ref} />
        <div tw="h-16 mb-32">{(isLoading || isValidating) && <LoadingSpinner />}</div>
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
        <Timeline
          data={data}
          mutate={mutate}
          checkForNewMumbles={checkForNewMumbles}
          quantityNewMumbles={quantityNewMumbles}
          handleRefreshPage={handleRefreshPage}
          renderMumbles={renderMumbles}
          hashtag={hashtag}
          creator={creator}
        />
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
