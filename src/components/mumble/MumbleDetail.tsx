import tw from 'twin.macro';
import Link from 'next/link';
import {
  Avatar,
  CommentButton,
  Paragraph,
  IconLink,
  User,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { Mumble, User as TUser } from '@/services';
import { elapsedTime } from '@/utils';
import { MumbleLike } from './MumbleLike';
import { MumbleShare } from './MumbleShare';
import { MumbleImage } from './MumbleImage';

type MumbleSingleProps = {
  mumble: Mumble;
  user: TUser;
};

export const MumbleDetail: React.FC<MumbleSingleProps> = ({ mumble, user }) => {
  return (
    <ArticleMumble id={mumble.id}>
      <ArticleHeader>
        <Avatar
          key={user ? user.id : ''}
          variant="medium"
          src={user && user.avatarUrl !== '' ? user.avatarUrl : '/avatar_default.png/'}
          alt={user ? user.userName : 'username'}
          href={`/profile/${user && user.id}`}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
        <ArticleHeaderContent>
          <User label={user ? `${user.firstName} ${user.lastName}` : 'Username'} variant="large" />
          <ArticleDatas>
            <IconLink
              label={user ? user.userName : 'username'}
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

      <Paragraph text={mumble.text} mbSpacing="16" size="large" />

      {mumble.mediaUrl && <MumbleImage mediaUrl={mumble.mediaUrl} text={mumble.text} />}

      <ArticleInteraction>
        <CommentButton
          type="comment"
          quantity={mumble.replyCount}
          href={`/mumble/${mumble.id}`}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
        <MumbleLike id={mumble.id} favourite={mumble.likedByUser} quantity={mumble.likeCount} />
        <MumbleShare id={mumble.id} />
      </ArticleInteraction>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-row gap-16`;
const ArticleInteraction = tw.div`flex flex-row flex-wrap justify-start items-start`;
