import tw from 'twin.macro';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'dayjs/locale/de-ch';
import dayjs from 'dayjs';

import {
  Avatar,
  CommentButton,
  LikeButton,
  ImageContainer,
  User,
  IconLink,
  Paragraph,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';

export interface MumbleProps {
  id: string;
  creator: string;
  text: string;
  mediaUrl: string;
  createdTimestamp: number;
  likeCount: number;
  likedByUser: boolean;
  replyCount: number;
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
}) => {
  const router = useRouter();
  const handleComment = (id: string) => {
    router.push(`/mumble/${id}`);
  };

  const handleShowUser = (id: string) => {
    router.push(`/profile/${id}`);
  };

  const convertedTime = dayjs(createdTimestamp).locale('de-ch').format('DD.MM.YYYY HH:MM:ss');

  return (
    <ArticleMumble id={id}>
      <ArticleHeader>
        <Link href={`/profile/${creator}`} title={creator} target="_self">
          <Avatar variant="medium" src="https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif" alt={creator} />
        </Link>
        <ArticleHeaderContent>
          <User label="Username" variant="large" />
          <ArticleDatas>
            <IconLink label={creator} type="username" color="violet" onClick={() => handleShowUser(creator)} />
            <IconLink
              label={convertedTime}
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

      <Paragraph text={text} mbSpacing="16" />
      {mediaUrl && <ImageContainer src={mediaUrl} alt={text} />}
      <ArticleInteraction>
        <CommentButton type="comment" quantity={replyCount} onClick={() => handleComment(id)} />
        <LikeButton favourite={likedByUser} quantity={likeCount} onClick={() => console.log('Like clicked')} />
      </ArticleInteraction>
    </ArticleMumble>
  );
};

export const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
export const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
export const ArticleHeaderContent = tw.div`flex flex-col`;
export const ArticleDatas = tw.div`flex flex-row gap-16`;
export const ArticleInteraction = tw.div`flex flex-row`;
