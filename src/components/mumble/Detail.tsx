import React from 'react';
import tw from 'twin.macro';
import Link from 'next/link';
import Message from '../../../data/content.json';
import { Mumble, User as TUser } from '@/services';
import { elapsedTime } from '@/utils';
import {
  Avatar,
  CommentButton,
  Paragraph,
  IconLink,
  User,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { Like } from './Like';
import { Share } from './Share';
import { MumbleImage } from './MumbleImage';
import { renderHashtags } from './Hashtag';

type MumbleSingleProps = {
  mumble: Mumble;
  user: TUser;
};

export const Detail: React.FC<MumbleSingleProps> = ({ mumble, user }) => {
  return (
    <ArticleMumble id={mumble.id}>
      <ArticleHeader>
        <Avatar
          key={user?.id}
          variant="medium"
          src={user?.avatarUrl !== '' ? user.avatarUrl : `${Message.contents.defaultAvatar.image}`}
          alt={user ? user.userName : `${Message.contents.userName.text}`}
          href={`/profile/${user && user.id}`}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
        <ArticleHeaderContent>
          <User label={user ? `${user.firstName} ${user.lastName}` : `${Message.contents.userName.text}`} variant="large" />
          <ArticleDatas>
            <IconLink
              label={user ? user.userName : `${Message.contents.userName.text}`}
              type="username"
              color="violet"
              href={`/profile/${user && user.id}`}
              legacyBehavior
              passHref
              linkComponent={Link}
            />
            <IconLink
              label={elapsedTime(mumble.createdTimestamp)}
              type="timestamp"
              color="slate"
              onClick={() => console.log('clicked timestamp')}
            />
          </ArticleDatas>
        </ArticleHeaderContent>
      </ArticleHeader>

      <Paragraph mbSpacing="16" size="large">
        {renderHashtags(mumble.text, 'large')}
      </Paragraph>

      {mumble.mediaUrl && <MumbleImage mediaUrl={mumble.mediaUrl} text={mumble.text} width={585} height={329.06} />}

      <ArticleInteraction>
        <CommentButton
          type="comment"
          quantity={mumble.replyCount}
          href={`/mumble/${mumble.id}`}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
        <Like id={mumble.id} favourite={mumble.likedByUser} quantity={mumble.likeCount} />
        <Share id={mumble.id} />
      </ArticleInteraction>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-row gap-16`;
const ArticleInteraction = tw.div`flex flex-row flex-wrap justify-start items-start`;
