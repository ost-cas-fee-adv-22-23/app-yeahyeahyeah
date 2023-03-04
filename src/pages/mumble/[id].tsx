import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import tw from 'twin.macro';
import { MumbleDetail, TextBoxComponent } from '@/components';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type Props = {
  mumble: {
    id: string;
  };
};

export default function MumblePage({ mumble }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <Container layout="plain">
      <MumbleDetail
        id={mumble.id}
        createdTimestamp={6546464654}
        mediaUrl={'https://picsum.photos/640/360'}
        text={mumble.id}
      />
      <TextBoxComponent variant="inline" />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
  console.log({ id });

  return {
    props: {
      mumble: { id },
    },
  };
};

export const ArticleMumble = tw.article`flex flex-col justify-start items-start w-full bg-slate-white py-32 pt-16 px-16 sm:px-48 rounded-lg mb-16`;
export const ArticleHeader = tw.div`flex flex-row items-center gap-16 relative left-0 sm:-left-[86px] mb-32`;
export const ArticleHeaderContent = tw.div`flex flex-col`;
export const ArticleDatas = tw.div`flex flex-row gap-16`;
export const ArticleInteraction = tw.div`flex flex-row`;
