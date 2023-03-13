import tw from 'twin.macro';
import Link from 'next/link';
import { elapsedTime } from '@/utils/timeConverter';
import useSWR from 'swr';
import {
  Avatar,
  CommentButton,
  ImageContainer,
  User,
  IconLink,
  Paragraph,
  Cancel,
  Container,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { MumbleLike } from './MumbleLike';
import { useSession } from 'next-auth/react';
import { fetchUser } from '@/services/fetchUser';
export interface MumbleProps {
  id: string;
  creator: string;
  text: string;
  mediaUrl: string;
  createdTimestamp: number;
  likeCount: number;
  likedByUser: boolean;
  replyCount: number;
  type: string;
  handleDeleteCallback?: (id: string) => void;
}

export const MumblePost: React.FC<MumbleProps> = ({
  id,
  creator,
  text,
  mediaUrl,
  createdTimestamp,
  likeCount,
  likedByUser,
  replyCount,
  type,
  handleDeleteCallback,
}) => {
  const { data: session }: any = useSession();
  const { data, isLoading }: any = useSWR({ url: '/api/user', id: creator, token: session?.accessToken }, fetchUser, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const handleClickTimestamp = () => {
    console.log('Timestamp clicked');
  };

  const handleDelete = (id: string) => {
    handleDeleteCallback && handleDeleteCallback(id);
  };

  return (
    <ArticleMumble id={id}>
      {type === 'post' ? (
        <Container layout="plain">
          <div tw="flex justify-between">
            <ArticleHeader>
              <Link href={`/profile/${creator}`} title={creator} target="_self">
                {isLoading ? (
                  <AvatarLoader>
                    <LoadingSpinner />
                  </AvatarLoader>
                ) : (
                  <Avatar
                    key={data ? data.id : ''}
                    variant="medium"
                    src={data?.avatarUrl !== '' ? data?.avatarUrl : '/avatar_default.png/'}
                    alt={data ? data.userName : 'username'}
                  />
                )}
              </Link>

              <ArticleHeaderContent>
                <User label={data ? `${data.firstName} ${data.lastName}` : 'Username'} variant="medium" />
                <ArticleDatas>
                  <IconLink
                    label={data ? data.userName : 'username'}
                    type="username"
                    color="violet"
                    href={`/profile/${id}`}
                    legacyBehavior
                    passHref
                    linkComponent={Link}
                  />
                  <IconLink
                    label={elapsedTime(createdTimestamp)}
                    type="timestamp"
                    color="slate"
                    onClick={handleClickTimestamp}
                  />
                </ArticleDatas>
              </ArticleHeaderContent>
            </ArticleHeader>
            <Cancel onClick={() => handleDelete(id)} />
          </div>
        </Container>
      ) : (
        <Container layout="plain">
          <div tw="flex justify-between">
            <ArticleHeaderReply>
              {type === 'reply' && (
                <Link href={`/profile/${creator}`} title={creator} target="_self">
                  <Avatar
                    key={data ? data.id : ''}
                    variant="small"
                    src={data?.avatarUrl !== '' ? data?.avatarUrl : '/avatar_default.png/'}
                    alt={data ? data.userName : 'username'}
                  />
                </Link>
              )}
              <ArticleHeaderContent>
                <User label={data ? `${data.firstName} ${data.lastName}` : 'Username'} variant="medium" />
                <ArticleDatas>
                  <IconLink
                    label={data ? data.userName : 'username'}
                    type="username"
                    color="violet"
                    href={`/profile/${id}`}
                    legacyBehavior
                    passHref
                    linkComponent={Link}
                  />
                  <IconLink
                    label={elapsedTime(createdTimestamp)}
                    type="timestamp"
                    color="slate"
                    onClick={handleClickTimestamp}
                  />
                </ArticleDatas>
              </ArticleHeaderContent>
            </ArticleHeaderReply>
            <Cancel onClick={() => handleDelete(id)} />
          </div>
        </Container>
      )}
      <Paragraph text={text} mbSpacing="16" />
      {mediaUrl && <ImageContainer src={mediaUrl} alt={text} />}
      <ArticleInteraction>
        <CommentButton
          type="comment"
          quantity={replyCount}
          href={`/mumble/${id}`}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
        <MumbleLike id={id} favourite={likedByUser} quantity={likeCount} />
      </ArticleInteraction>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-center gap-16 w-full relative -left-16 sm:-left-[88px] mb-16 sm:(mb-32)`;
const ArticleHeaderReply = tw.div`flex flex-row items-center gap-8 w-full relative left-0 mb-16 sm:(mb-32)`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-col gap-8 sm:(flex-row gap-16)`;
const ArticleInteraction = tw.div`flex flex-row`;
const AvatarLoader = tw.div`h-70 w-70 rounded-full flex justify-center items-center bg-violet-200 border-4 border-slate-300`;
