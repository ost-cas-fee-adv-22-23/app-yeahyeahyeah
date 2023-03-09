import { useState } from 'react';
import tw from 'twin.macro';
import Link from 'next/link';
import { elapsedTime } from 'lib/timeConverter';
import useSWR from 'swr';
import {
  Avatar,
  CommentButton,
  LikeButton,
  ImageContainer,
  IconLink,
  Modal,
  Paragraph,
  ShareButton,
  User,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { Mumble } from '@/qwacker';
import { useSession } from 'next-auth/react';
import { fetchUser } from '@/fetchUser';
import Image from 'next/image';

export const MumblePost: React.FC<Mumble> = ({
  id,
  creator,
  text,
  mediaUrl,
  createdTimestamp,
  likeCount,
  likedByUser,
  replyCount,
}) => {
  const { data: session }: any = useSession();
  const [open, setOpen] = useState(false);
  const { data }: any = useSWR({ url: '/api/user', id: creator, token: session?.accessToken }, fetchUser, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const handleClickTimestamp = () => {
    console.log('Timestamp clicked');
  };

  return (
    <ArticleMumble id={id}>
      <ArticleHeader>
        <Link href={`/profile/${creator}`} title={creator} target="_self">
          <Avatar
            key={data ? data.id : ''}
            variant="medium"
            src="https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif"
            alt={data ? data.userName : 'username'}
          />
        </Link>
        <ArticleHeaderContent>
          <User label={data ? `${data.firstName} ${data.lastName}` : 'Username'} variant="large" />
          <ArticleDatas>
            <IconLink
              label={data ? data.userName : 'username'}
              type="username"
              color="violet"
              href={`/profile/${id}`}
              legacyBehavior
              passHref
              linkComponent={Link}
            />
            <IconLink label={elapsedTime(createdTimestamp)} type="timestamp" color="slate" onClick={handleClickTimestamp} />
          </ArticleDatas>
        </ArticleHeaderContent>
      </ArticleHeader>
      <Paragraph text={text} mbSpacing="16" />
      {mediaUrl && <ImageContainer src={mediaUrl} alt={text} onImageIconClick={() => setOpen(!open)} />}
      <ArticleInteraction>
        <CommentButton
          type="comment"
          quantity={replyCount}
          href={`/mumble/${id}`}
          legacyBehavior
          passHref
          linkComponent={Link}
        />
        <LikeButton favourite={likedByUser} quantity={likeCount} onClick={() => console.log('Like clicked')} />
        <ShareButton label="Copy link" onClick={() => console.log('share clicked')} />
      </ArticleInteraction>
      <Modal label={data ? data.userName : 'username'} onClose={() => !open} isOpen={open} wide={true}>
        {mediaUrl && <Image unoptimized src={mediaUrl} alt={text} width="560" height="768" loading="lazy" />}
      </Modal>
    </ArticleMumble>
  );
};

const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
const ArticleHeader = tw.div`flex flex-row items-center gap-16 w-full relative left-0 sm:-left-[86px] mb-16 sm:(mb-32)`;
const ArticleHeaderContent = tw.div`flex flex-col`;
const ArticleDatas = tw.div`flex flex-col gap-8 sm:(flex-row gap-16)`;
const ArticleInteraction = tw.div`flex flex-row`;
