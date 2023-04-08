import React, { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { NextSeo } from 'next-seo';
import tw from 'twin.macro';
import Message from '../../../data/content.json';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { fetchMyLikes, fetchMyMumbles, fetchUser, User } from '@/services';
import { FetchMumbles } from '@/types/fallback';
import { MumbleHeader } from '@/components';
import { Container, Switch } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { Stream } from '@/components/stream/Stream';

type MumbleHeaderProps = {
  creator: any;
  limit: number;
  fallbackUser: { '/api/user': User };
  fallBackMyMumbles: { '/api/myMumbles': FetchMumbles };
  fallBackMyLikes: { '/api/myLikes': FetchMumbles };
};

const ProfilePage = ({ creator, limit, fallbackUser, fallBackMyMumbles, fallBackMyLikes }: MumbleHeaderProps) => {
  const { data: session }: any = useSession();
  const [selection, setSelection] = useState('mumbles');

  const handleSelection = (value: string) => {
    setSelection(value);
  };

  return (
    <>
      <NextSeo
        title={`${session && session.user.firstname} ${session && session.user.lastname}'s mumble profile`}
        description={`Das Mumble-Profile von ${
          session && session.user.username
        }. Mumble, die Chat-App des CAS Frontend Engineer Advanced 2023.`}
        canonical={process.env.NEXT_PUBLIC_URL}
      />

      <Container layout="plain">
        <MumbleHeader creator={creator} fallbackUser={fallbackUser} />

        {session?.user.id === creator.id ? (
          <>
            <SwitchContentWrapper>
              <Switch
                fCallBack={(value) => handleSelection(value)}
                options={[
                  {
                    label: `${Message.contents.switch.mumbles}`,
                    value: 'mumbles',
                  },
                  {
                    label: `${Message.contents.switch.mumbles}`,
                    value: 'likes',
                  },
                ]}
                value="mumbles"
              />
            </SwitchContentWrapper>

            <SelectionWrapper>
              {selection === 'mumbles' && (
                <Stream
                  url="/api/myMumbles"
                  limit={limit}
                  fallback={fallBackMyMumbles['/api/myMumbles']}
                  fetcher={fetchMyMumbles}
                  creator={creator}
                />
              )}
              {selection === 'likes' && (
                <Stream
                  url="/api/myLikes"
                  // TODO: limit is set to 20 because we have to intercept the data in the fetcher function
                  limit={20}
                  fallback={fallBackMyLikes['/api/myLikes']}
                  fetcher={fetchMyLikes}
                  creator={creator}
                />
              )}
            </SelectionWrapper>
          </>
        ) : (
          <SelectionWrapper>
            {selection === 'mumbles' && (
              <Stream
                url="/api/myMumbles"
                limit={limit}
                fallback={fallBackMyMumbles['/api/myMumbles']}
                fetcher={fetchMyMumbles}
                creator={creator}
              />
            )}
          </SelectionWrapper>
        )}
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<any> = async ({ req, query: { id } }: GetServerSidePropsContext) => {
  // TODO: if limit is only 2, the stream is not loading more items - why?
  const limit = 2;
  const _id = id as string;

  const token = await getToken({ req });
  const user: User | string = token?.accessToken ? await fetchUser({ id: _id, token: token?.accessToken }) : '';
  const myMumbles: FetchMumbles = await fetchMyMumbles({ creator: _id, token: token?.accessToken });
  const myLikes: FetchMumbles = await fetchMyLikes({ token: token?.accessToken });

  return {
    props: {
      creator: id && { id: _id },
      limit,
      fallbackUser: {
        '/api/user': user || {
          userName: 'username',
          firstName: 'Unknown',
          lastName: 'User',
          avatarUrl: '',
        },
      },
      fallBackMyMumbles: {
        '/api/myMumbles': myMumbles,
      },
      fallBackMyLikes: {
        '/api/myLikes': myLikes,
      },
    },
  };
};

export default ProfilePage;

const SwitchContentWrapper = tw.div`flex flex-row mt-16 w-full sm:(mt-0)`;
const SelectionWrapper = tw.div`mt-16 mb-16`;
