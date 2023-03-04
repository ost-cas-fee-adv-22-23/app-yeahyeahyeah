import tw from 'twin.macro';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Avatar,
  CommentButton,
  LikeButton,
  ImageContainer,
  User,
  IconLink,
  Paragraph,
  ShareButton,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleSingleProps = {
  id: string;
  createdTimestamp: number;
  mediaUrl: string;
  text: string;
};

export const MumbleDetail: React.FC<MumbleSingleProps> = ({ id, createdTimestamp, mediaUrl, text }) => {
  const router = useRouter();

  const handleShowUser = () => {
    router.push(`/profile/${id}`);
  };

  return (
    <ArticleMumble id={id}>
      <ArticleHeader>
        <Avatar
          alt="Image description"
          href={`/profile/${id}`}
          title={id}
          src="https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif"
          variant="medium"
        />
        <ArticleHeaderContent>
          <User label="Username" variant="large" />
          <ArticleDatas>
            <IconLink label="Username" type="username" color="violet" onClick={handleShowUser} />
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

      <Paragraph text={text} mbSpacing="16" size="large" />

      {mediaUrl && <ImageContainer src={mediaUrl} alt={text} />}

      <ArticleInteraction>
        <CommentButton type="comment" quantity={45} legacyBehavior passHref href={`/mumble/${id}`} linkComponent={Link} />
        <LikeButton favourite={false} quantity={0} onClick={() => console.log('Like clicked')} />
        <ShareButton label="Copy link" />
      </ArticleInteraction>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-row gap-16`;
const ArticleInteraction = tw.div`flex flex-row`;
