import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { MumbleHeader } from '@/components';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type ProfilePageProps = {
  profile: {
    alias: string;
  };
};

export default function ProfilePage({ profile }: ProfilePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
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
