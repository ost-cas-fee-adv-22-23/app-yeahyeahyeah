import { NextSeo } from 'next-seo';
import tw, { styled, css } from 'twin.macro';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Footer } from '@/components';
import KeyWords from '@/components/content/KeyWords';
import { Button, MumbleLogo, Paragraph, TextButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export type StartScreen = React.DOMAttributes<HTMLDivElement>;

export const StartScreen: React.FC<StartScreen> = () => {
  const router = useRouter();

  const handleLogin = () => {
    signIn('zitadel');
  };

  const handleSignup = () => {
    router.push('https://cas-fee-advanced-ocvdad.zitadel.cloud/ui/login/loginname');
  };

  return (
    <>
      <NextSeo
        title="Mumble - Willkommen auf Mumble."
        description="Are you ready to mumble? Jetzt registrieren und loslegen."
        canonical="https://mumble-yeahyeahyeah.ch"
      />
      <LayoutWrapper>
        <LeftColumn>
          <div tw="mb-48">
            <MumbleLogo alignment="vertical" color="white" isNavigation={false} />
          </div>
          <div tw="w-full sm:w-3/4">
            <h1 tw="text-2xl lg:(text-4xl) font-bold text-pink-300 text-center">
              Find out whats new <br />
              in <KeyWords />{' '}
            </h1>
          </div>
        </LeftColumn>
        <RightColumn>
          <RightColumnContentWrapper>
            <h2 tw="text-xl sm:text-4xl font-bold text-pink-300 text-center whitespace-nowrap text-slate-900">Anmelden</h2>
            <Button label="Let's mumble" icon="logo" size="large" width="full" color="gradient" onClick={handleLogin} />
            <div tw="flex flex-row justify-center items-center w-full gap-8">
              <div>
                <Paragraph text="Noch kein Account?" size="default" color="dark" alignment="center" />
              </div>
              <div>
                <TextButton onClick={handleSignup} label="Jetzt registrieren" />
              </div>
            </div>
          </RightColumnContentWrapper>
          <div tw="items-end justify-center">
            <Footer />
          </div>
        </RightColumn>
      </LayoutWrapper>
    </>
  );
};

const LayoutWrapper = tw.div`flex flex-col justify-between items-start w-full h-screen sm:(flex-row)`;

const LeftColumn = styled.div(() => [
  tw`flex flex-col justify-center items-center bg-gradient-to-b from-pink-400 to-violet-500 w-full h-1/2 sm:(w-1/2 h-full p-0) `,
  css`
    background: linear-gradient(153.75deg, #ec4899 -75.32%, #7c3aed 100%);
    h1 {
      line-height: 32px;
    }
  `,
]);

const RightColumn = tw.div`flex flex-col justify-center items-center bg-slate-white w-full h-1/2 sm:(w-1/2 h-full) `;
const RightColumnContentWrapper = tw.div`flex flex-col justify-center items-center w-full h-full lg:(w-1/2) gap-16 p-16`;
