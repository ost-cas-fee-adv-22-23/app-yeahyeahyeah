import tw from 'twin.macro';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { useSession } from 'next-auth/react';
import { elapsedTime } from '@/utils/timeConverter';
import useSWR from 'swr';
import {
  Avatar,
  CommentButton,
  User,
  IconLink,
  IconButton,
  Paragraph,
  Cancel,
  Image as TheImage,
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

  const myLoader = (src: any) => {
    console.log(src.src);

    return `${src.src}`;
  };

  return (
    <ArticleMumble id={id}>
      {type === 'post' ? (
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
      ) : (
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
      )}
      <Paragraph text={text} mbSpacing="16" />
      {mediaUrl && (
        <ImageWrapper>
          <TheImage
            loader={myLoader}
            src={mediaUrl}
            alt="Picture of the author"
            width={594}
            height={340}
            objectFit="cover"
            imageComponent={Image}
          />
        </ImageWrapper>
      )}
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
        <div tw="flex content-end">
          {creator === session?.user?.id && (
            <IconButton label="Delete Post" icon="cancel" variant="plain" onClick={() => handleDelete(id)} />
          )}
        </div>
      </ArticleInteraction>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-start sm:(items-center) gap-16 w-full relative -left-16 sm:-left-[88px] mb-16 sm:(mb-32)`;
const ArticleHeaderReply = tw.div`flex flex-row items-center gap-8 w-full relative left-0 mb-16 sm:(mb-32)`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-col gap-8 sm:(flex-row gap-16)`;
const ArticleInteraction = tw.div`flex flex-row justify-between items-center flex-wrap mt-16`;
const ImageWrapper = tw.div`flex rounded-lg overflow-hidden`;
