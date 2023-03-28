import tw, { styled, css } from 'twin.macro';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { Button, MumbleLogo, Paragraph, TextButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';

const LandingPage: React.FC = () => {
  const { data: session }: any = useSession();
  const router = useRouter();

  const handleLogin = () => {
    signIn('zitadel');
  };

  const handleSignup = () => {
    router.push('https://cas-fee-advanced-ocvdad.zitadel.cloud/ui/login/loginname');
  };

  if (session) {
    console.log('has session');
    router.push('/');
  }

  return (
    <>
      <LayoutWrapper>
        <LeftColumn>
          <div tw="mb-32">
            <MumbleLogo alignment="vertical" color="white" isNavigation={false} onLogoClick={function noRefCheck() {}} />
          </div>
          <div tw="w-1/2">
            <h1 tw="text-4xl font-bold text-pink-300 text-center">
              Find out whats new <br /> in <span tw="text-4xl font-bold text-slate-white">#fashion</span>.
            </h1>
          </div>
        </LeftColumn>
        <RightColumn>
          <div tw="flex flex-col justify-center items-start w-1/2 gap-16">
            <Button label="Anmelden" icon="logo" size="large" width="full" color="gradient" onClick={handleLogin} />
            <div tw="flex flex-row justify-start items-baseline w-full gap-8">
              <div tw="grow-0">
                <Paragraph text="Noch kein Account?" size="default" color="dark" />
              </div>
              <div tw="grow">
                <TextButton onClick={handleSignup} label="Jetzt registrieren" />
              </div>
            </div>
          </div>
        </RightColumn>
      </LayoutWrapper>
    </>
  );
};

export default LandingPage;

const LayoutWrapper = tw.div`flex justify-between items-start w-full h-screen`;

const LeftColumn = styled.div(() => [
  tw`flex flex-col justify-center items-center bg-gradient-to-b from-pink-400 to-violet-500 w-1/2 h-full`,
  css`
    background: linear-gradient(153.75deg, #ec4899 -75.32%, #7c3aed 100%);
  `,
]);

const RightColumn = tw.div`flex justify-center items-center bg-slate-white w-1/2 h-full`;
