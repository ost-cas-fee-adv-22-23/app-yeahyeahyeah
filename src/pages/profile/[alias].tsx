import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { MumbleHeader } from '@/components';

type Props = {
  profile: {
    alias: string;
  };
};

export default function ProfilePage({ profile }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <Container layout="plain">
      <MumbleHeader alias={profile.alias} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query: { alias } }) => {
  return {
    props: {
      profile: { alias },
    },
  };
};
