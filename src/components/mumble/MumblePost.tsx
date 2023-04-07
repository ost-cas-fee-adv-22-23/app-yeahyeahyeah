import React from 'react';
import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { elapsedTime } from '@/utils/timeConverter';
import { fetchUser, Mumble } from '@/services';
import {
  Avatar,
  CommentButton,
  Cancel,
  IconLink,
  User,
  Paragraph,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { MumbleLike } from './MumbleLike';
import { MumbleShare } from './MumbleShare';
import { MumbleImage } from './MumbleImage';
import { renderHashtags } from '@/components/mumble/MumbleHashtag';

type MumbleProps = {
  type: string;
  handleDeleteCallback?: (id: string) => void;
} & Mumble;

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

  const handleDelete = (id: string) => {
    handleDeleteCallback && handleDeleteCallback(id);
  };

  return (
    <ArticleMumble id={id} type={type}>
      <ArticleHeader type={type}>
        <Link href={`/profile/${creator}`} title={creator} target="_self">
          <Avatar
            key={creator ? creator : ''}
            variant={type === 'post' ? 'medium' : 'small'}
            src={data && data.avatarUrl !== '' ? data.avatarUrl : '/schielen.jpeg'}
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
              href={`/mumble/${id}`}
              legacyBehavior
              passHref
              linkComponent={Link}
            />
          </ArticleDatas>
        </ArticleHeaderContent>
      </ArticleHeader>

      <Paragraph mbSpacing="16">{renderHashtags(text, 'small')}</Paragraph>

      {mediaUrl && <MumbleImage mediaUrl={mediaUrl} text={text} width={585} height={329.06} />}

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
        <ArticleInteractionDelete>
          {creator === session?.user?.id && (
            <Cancel
              tw="fill-slate-300 cursor-pointer transition scale-100 ease-in-out delay-100 hover:(fill-pink-900 rotate-180 transform-gpu duration-500 scale-150)"
              onClick={() => handleDelete(id)}
            />
          )}
        </ArticleInteractionDelete>
      </ArticleInteraction>
    </ArticleMumble>
  );
};

interface ArticleHeaderProps {
  type: string;
}

const ArticleMumble = styled.article(({ type }: ArticleHeaderProps) => [
  tw`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg`,
  type === 'reply' && tw`mb-0`,
  type === 'post' && tw`mb-16`,
]);

const ArticleHeader = styled.div(({ type }: ArticleHeaderProps) => [
  tw`flex flex-row items-start sm:(items-center) gap-16 w-full`,
  type === 'reply' && tw`flex flex-row items-center gap-8 w-full relative left-0 mb-16`,
  type === 'post' && tw`relative -left-16 sm:-left-[84px] mb-16`,
]);

const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-wrap gap-8 sm:(flex-row gap-16)`;
const ArticleInteraction = tw.div`relative -left-8 flex flex-row justify-start items-center flex-wrap sm:w-full sm:gap-24`;
const ArticleInteractionDelete = tw.div`flex justify-end items-center grow pr-4 mb-8`;
