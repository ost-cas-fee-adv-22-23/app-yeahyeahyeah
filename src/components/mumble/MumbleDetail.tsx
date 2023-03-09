import tw from 'twin.macro';
import Link from 'next/link';
import { Mumble } from '@/qwacker';

import {
  Avatar,
  CommentButton,
  LikeButton,
  ImageContainer,
  User,
  IconLink,
  Paragraph,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';

export const MumbleDetail: React.FC<Mumble> = ({ id, createdTimestamp, mediaUrl, text }) => {
  return (
    <ArticleMumble id={id}>
      <ArticleHeader>
        <Avatar variant="medium" src="https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif" alt="Username" />
        <ArticleHeaderContent>
          <User label="Username" variant="large" />
          <ArticleDatas>
            <IconLink
              label={'username'}
              type="username"
              color="violet"
              href={`/profile/${id}`}
              legacyBehavior
              passHref
              linkComponent={Link}
            />
            <IconLink
              label={createdTimestamp.toString()}
              type="timestamp"
              color="slate"
              href="/"
              legacyBehavior
              passHref
              linkComponent={Link}
            />
          </ArticleDatas>
        </ArticleHeaderContent>
      </ArticleHeader>

      <Paragraph text={id} mbSpacing="16" size="large" />

      {mediaUrl && <ImageContainer src={mediaUrl} alt={text} />}

      <ArticleInteraction>
        <CommentButton type="comment" quantity={64} href={`/mumble/${id}`} legacyBehavior passHref linkComponent={Link} />
        <LikeButton favourite={false} quantity={42} onClick={() => console.log('Like clicked')} />
      </ArticleInteraction>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-row gap-16`;
const ArticleInteraction = tw.div`flex flex-row`;
