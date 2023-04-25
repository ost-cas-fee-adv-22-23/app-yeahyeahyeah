import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import useOnScreen from '@/hooks/useOnScreen';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { alertService, deleteMumble } from '@/services';
import { FetchMumbles } from '@/types/fallback';
import { MumbleFetcher, SearchMumblesFetcher, StreamHook } from '@/types/swr';
import debounce from 'lodash.debounce';

export function useStream(
  url: string,
  limit: number,
  fallback: FetchMumbles,
  fetcher: MumbleFetcher | SearchMumblesFetcher,
  id?: string,
  hashtag?: string,
  creator?: { id: string }
) {
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
    // Hint: For better user experience, set this to true (more requests especially if small limit is set)
    revalidateAll: false,
    parallel: true,
  });

  const { data: newMumbles } = useSWR(
    id || hashtag || creator
      ? null
      : {
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
  }, 200);

  useEffect(() => {
    // TODO: id is needed on profile page, because there is no possibility for setting offset and limit on endpoint
    if (!id && isOnScreen && !isValidating && data && data.length * limit <= data[0].count)
      handleIntersectionCallbackDebounced();
  });

  const checkForNewMumbles = data && data[0]?.mumbles[0]?.id && newMumbles && newMumbles.count > 0;

  const quantityNewMumbles =
    data && data[0]?.mumbles[0]?.id && newMumbles && newMumbles.count === 1
      ? '1 neuer Mumble'
      : `${newMumbles && newMumbles.count} neue Mumbles`;

  const renderTimeline = !creator && !id;

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht löschen!!', {
        autoClose: true,
        keepAfterRouteChange: false,
      });
      return;
    }
    const res = await deleteMumble(id, session?.accessToken);

    //TODO: Is this a magic number, i don't think so.
    if (res.status === 204) {
      mutate();
    }
  };

  const handleRefreshPage = () => {
    mutate();
    window.scrollTo(0, 0);
  };

  return [
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
  ] as StreamHook;
}
