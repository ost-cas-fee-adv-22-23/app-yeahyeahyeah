import tw from 'twin.macro';
import Link from 'next/link';
import {
  Avatar,
  CommentButton,
  LikeButton,
  ImageContainer,
  User,
  IconLink,
  Paragraph,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { Mumble } from '@/services';
import { elapsedTime } from '@/utils';
import { MumbleLike } from './MumbleLike';

type MumbleSingleProps = {
  mumble: Mumble;
  user: any;
};

export const MumbleDetail: React.FC<MumbleSingleProps> = ({ mumble, user }) => {
  return (
    <ArticleMumble id={mumble.id}>
      <ArticleHeader>
        <Avatar variant="medium" src="https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif" alt="Username" />
        <ArticleHeaderContent>
          <User label={user ? `${user.firstName} ${user.lastName}` : 'Username'} variant="large" />
          <ArticleDatas>
            <IconLink
              label={user ? user.userName : 'username'}
              type="username"
              color="violet"
              href={`/profile/${mumble.id}`}
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

      {mumble.mediaUrl && <ImageContainer src={mumble.mediaUrl} alt={mumble.text} />}

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
      </ArticleInteraction>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-row gap-16`;
const ArticleInteraction = tw.div`flex flex-row`;
