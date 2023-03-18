import tw from 'twin.macro';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
import { fetchUser } from '@/services/fetchUser';
import { MumbleLike } from './MumbleLike';
import { MumbleShare } from './MumbleShare';
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
  const { data } = useSWR({ url: '/api/user', id: creator, token: session?.accessToken }, fetchUser, {
    revalidateOnFocus: false,
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
                <Avatar
                  key={creator ? creator : ''}
                  variant="medium"
                  src={data && data.avatarUrl !== '' ? data.avatarUrl : '/avatar_default.png/'}
                  alt={data ? data.userName : 'username'}
                />
              </Link>
              <ArticleHeaderContent>
                <User label={data ? `${data.firstName} ${data.lastName}` : 'Username'} variant="medium" />
                <ArticleDatas>
                  <IconLink
                    label={data ? data.userName : 'username'}
                    type="username"
                    color="violet"
                    href={`/profile/${creator}`}
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
            {creator === session?.user?.id && <Cancel tw="fill-slate-300" onClick={() => handleDelete(id)} />}
          </div>
        </Container>
      ) : (
        <Container layout="plain">
          <div tw="flex justify-between">
            <ArticleHeaderReply>
              {type === 'reply' && (
                <Link href={`/profile/${creator}`} title={creator} target="_self">
                  <Avatar
                    key={creator ? creator : ''}
                    variant="small"
                    src={data && data.avatarUrl !== '' ? data.avatarUrl : '/avatar_default.png/'}
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
                    href={`/profile/${creator}`}
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
            {creator === session?.user?.id && <Cancel tw="fill-slate-300" onClick={() => handleDelete(id)} />}
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
        <MumbleShare id={id} />
      </ArticleInteraction>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-start sm:(items-center) gap-16 w-full relative -left-16 sm:-left-[88px] mb-16 sm:(mb-32)`;
const ArticleHeaderReply = tw.div`flex flex-row items-center gap-8 w-full relative left-0 mb-16 sm:(mb-32)`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-col gap-8 sm:(flex-row gap-16)`;
const ArticleInteraction = tw.div`flex flex-row flex-wrap`;
