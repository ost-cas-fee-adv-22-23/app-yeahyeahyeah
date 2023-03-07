import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { MumbleHeader } from '@/components';
import { Container } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type MumbleHeaderProps = {
  alias: string;
};

export default function ProfilePage({ alias }: MumbleHeaderProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <Container layout="plain">
      <MumbleHeader alias={alias} />
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
