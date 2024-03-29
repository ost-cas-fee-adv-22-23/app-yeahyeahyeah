import React from 'react';
import { FetchMumbles } from '@/types/fallback';
import { useStream } from '@/hooks';
import { MumbleFetcher, SearchMumblesFetcher } from '@/types/swr';
import { Listing } from '../mumble/Listing';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { Timeline } from '../mumble/Timeline';
import { TextBoxComponent } from '../form/TextBoxComponent';
import { Alert } from '../alert/Alert';
import { QwackerUserResponse, User, alertService } from '@/services';

type StreamProps = {
  url: string;
  limit: number;
  fallback: FetchMumbles;
  fallbackUsers?: QwackerUserResponse;
  fallbackUserLoggedIn?: User;
  fetcher: MumbleFetcher | SearchMumblesFetcher;
  id?: string;
  hashtag?: string;
  creator?: { id: string };
};

export const Stream: React.FC<StreamProps> = ({
  limit,
  fallback,
  hashtag,
  fetcher,
  creator,
  url,
  id,
  fallbackUsers,
  fallbackUserLoggedIn,
}) => {
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
          mutate={mutate}
          checkForNewMumbles={checkForNewMumbles}
          quantityNewMumbles={quantityNewMumbles}
          handleRefreshPage={handleRefreshPage}
          renderMumbles={renderMumbles}
          hashtag={hashtag}
          creator={creator}
          fallbackUserLoggedIn={fallbackUserLoggedIn}
        />
      ) : (
        <>
          {id ? (
            <>
              <TextBoxComponent id={id} variant="write" mutate={mutate} fallbackUserLoggedIn={fallbackUserLoggedIn} />
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
