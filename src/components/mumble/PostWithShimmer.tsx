import React from 'react';
import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import Message from '../../../data/content.json';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { elapsedTime } from '@/utils/timeConverter';
import { fetchUser, Mumble, QwackerUserResponse } from '@/services';
import {
  Avatar,
  CommentButton,
  Cancel,
  IconLink,
  User,
  Paragraph,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { Like } from './Like';
import { Share } from './Share';
import { Picture } from './Picture';
import { renderHashtags } from './Hashtag';

type PostWithShimmerProps = {
  type: string;
  $isReply?: boolean;
  handleDeleteCallback?: (id: string) => void;
  fallbackUsers?: QwackerUserResponse;
} & Mumble;

export const PostWithShimmer: React.FC<PostWithShimmerProps> = ({
  id,
  creator,
  text,
  mediaUrl,
  createdTimestamp,
  likeCount,
  likedByUser,
  replyCount,
  type,
  $isReply,
  handleDeleteCallback,
  fallbackUsers,
}) => {
  const { data: session }: any = useSession();

  const { data } = useSWR(
    session?.accessToken ? { url: '/api/user', id: creator, token: session?.accessToken } : null,
    fetchUser,
    {
      revalidateOnFocus: false,
      fallbackData: fallbackUsers?.data.find((x) => x.id === creator),
    }
  );

  const handleDelete = (id: string) => {
    handleDeleteCallback && handleDeleteCallback(id);
  };

  const handleShimmer = (type: string) => {
    switch (type) {
      case 'user':
        return <UserWrapper></UserWrapper>;
      case 'content':
        return <ContentWrapper></ContentWrapper>;
      case 'image':
        return <ImageWrapper></ImageWrapper>;
      default:
        break;
    }
  };

  return (
    <ArticleMumble id={id} type={type} $isReply={$isReply}>
      <ArticleHeader type={type}>
        <Link href={`/profile/${creator}`} title={creator} target="_self">
          <Avatar
            key={creator ? creator : ''}
            variant={type === 'post' ? 'medium' : 'small'}
            src={data && data.avatarUrl !== '' ? data.avatarUrl : `${Message.contents.defaultAvatar.image}`}
            alt={data ? data.userName : `${Message.contents.userName.text}`}
          />
        </Link>
        <ArticleHeaderContent>
          <User label={data ? `${data.firstName} ${data.lastName}` : `${Message.contents.userName.text}`} variant="medium" />
          <ArticleDatas>
            {data && data.userName ? (
              <IconLink
                label={data.userName}
                type="username"
                color="violet"
                href={`/profile/${creator}`}
                legacyBehavior
                passHref
                linkComponent={Link}
              />
            ) : (
              <>{handleShimmer('user')}</>
            )}
            {data && createdTimestamp ? (
              <IconLink
                label={elapsedTime(createdTimestamp)}
                type="timestamp"
                color="slate"
                href={`/mumble/${id}`}
                legacyBehavior
                passHref
                linkComponent={Link}
              />
            ) : (
              <>{handleShimmer('user')}</>
            )}
          </ArticleDatas>
        </ArticleHeaderContent>
      </ArticleHeader>

      {data && data.userName ? (
        <Paragraph mbSpacing="16">{renderHashtags(text, 'small')}</Paragraph>
      ) : (
        <>{handleShimmer('content')}</>
      )}

      {data && mediaUrl ? (
        <Picture mediaUrl={mediaUrl} text={text} width={585} height={329.06} />
      ) : (
        <>{!data?.userName && mediaUrl && <>{handleShimmer('image')}</>}</>
      )}

      <ArticleInteraction>
        {data && data.userName ? (
          <CommentButton
            type="comment"
            quantity={replyCount}
            href={`/mumble/${id}`}
            legacyBehavior
            passHref
            linkComponent={Link}
          />
        ) : (
          <>{handleShimmer('user')}</>
        )}
        {data && data.userName ? (
          <Like id={id} favourite={likedByUser} quantity={likeCount} />
        ) : (
          <>{handleShimmer('user')}</>
        )}
        {data && data.userName ? <Share id={id} /> : <>{handleShimmer('user')}</>}
        <ArticleInteractionDelete>
          {creator === session?.user?.id && <Cancel css={Delete.svg()} onClick={() => handleDelete(id)} />}
        </ArticleInteractionDelete>
      </ArticleInteraction>
    </ArticleMumble>
  );
};

interface ArticleHeaderProps {
  type: string;
  $isReply?: boolean;
}

const ArticleMumble = styled.article(({ type, $isReply }: ArticleHeaderProps) => [
  tw`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48`,
  type === 'reply' && tw`mb-0`,
  type === 'post' && tw`mb-16`,
  $isReply === true && tw`border-t-1 border-slate-200 pt-16`,
  $isReply === false && tw`rounded-lg`,
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
const Delete = {
  svg: () => [
    tw`fill-slate-300 cursor-pointer transition scale-100 ease-in-out delay-100 hover:(fill-pink-900 rotate-180 transform-gpu duration-500 scale-150)`,
  ],
};
const UserWrapper = tw.div`fill-slate-300 cursor-pointer transition scale-100 ease-in-out delay-100 hover:(fill-pink-900 rotate-180 transform-gpu duration-500 scale-150)`;
const ContentWrapper = tw.div`flex flex-row grow w-full h-24 rounded-xl bg-slate-300 animate-pulse mb-16`;
const ImageWrapper = tw.div`flex flex-row grow w-full h-[320px] rounded-xl bg-slate-300 animate-pulse mb-16`;
