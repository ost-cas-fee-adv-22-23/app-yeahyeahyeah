import React from 'react';
import Link from 'next/link';
import Message from '../../../data/content.json';
import tw, { styled } from 'twin.macro';
import { Avatar, User } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export interface MumbleShimmerProps {
  id: string;
  type: string;
}

export const MumbleShimmer: React.FC<MumbleShimmerProps> = ({ id, type }) => {
  return (
    <ArticleMumble id={id} type={type}>
      <ArticleHeader type={type}>
        <Link href={`/profile/profile`} title={'title'} target="_self">
          <Avatar
            key={id}
            variant={type === 'post' ? 'medium' : 'small'}
            src={`${Message.contents.defaultAvatar.image}`}
            alt={`${Message.contents.userName.text}`}
          />
        </Link>
        <ArticleHeaderContent>
          <User label={'Username'} variant="medium" />
          <ArticleDatas>
            {Array.from(Array(2).keys()).map((arr) => (
              <div key={arr + 'id'} tw="flex flex-row grow w-96 h-[14px] rounded-full bg-slate-300 animate-pulse"></div>
            ))}
          </ArticleDatas>
        </ArticleHeaderContent>
      </ArticleHeader>

      <div tw="flex flex-row grow w-full h-172 rounded-xl bg-slate-300 animate-pulse mb-16"></div>
      <div tw="flex flex-row grow w-full h-[320px] rounded-xl bg-slate-300 animate-pulse mb-16"></div>

      <ArticleInteraction>
        {Array.from(Array(3).keys()).map((arr) => (
          <div key={arr + 'id'} tw="flex flex-row grow w-96 h-[14px] rounded-full bg-slate-300 animate-pulse"></div>
        ))}
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
