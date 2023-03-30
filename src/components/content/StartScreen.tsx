import { NextSeo } from 'next-seo';
import tw, { styled, css } from 'twin.macro';
import { signIn } from 'next-auth/react';
import { Footer } from './Footer';
import KeyWords from '@/components/content/KeyWords';
import { Button, MumbleLogo, Paragraph, TextButton } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export type StartScreen = React.DOMAttributes<HTMLDivElement>;

export const StartScreen: React.FC<StartScreen> = () => {
  const handleLogin = () => {
    signIn('zitadel');
  };

  const handleSignup = () => {
    signIn('zitadel');
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
          <div tw="w-full sm:w-4/5">
            <HeadingH1>
              Find out whats new <br />
              in <KeyWords />
            </HeadingH1>
          </div>
        </LeftColumn>
        <RightColumn>
          <RightColumnContentWrapper>
            <HeadingH2>Anmelden</HeadingH2>
            <Button label="Let's mumble" icon="logo" size="large" width="full" color="gradient" onClick={handleLogin} />
            <RightColumnContent>
              <div>
                <Paragraph size="default" color="dark" alignment="center">
                  Noch kein Account?
                </Paragraph>
              </div>
              <div>
                <TextButton onClick={handleSignup} label="Jetzt registrieren" />
              </div>
            </RightColumnContent>
          </RightColumnContentWrapper>
          <FooterWrapper>
            <Footer />
          </FooterWrapper>
        </RightColumn>
      </LayoutWrapper>
    </>
  );
};

const LayoutWrapper = tw.div`flex flex-col justify-between items-start w-full h-screen sm:(flex-row)`;
const LeftColumn = styled.section(() => [
  tw`flex flex-col justify-center items-center bg-gradient-to-b from-pink-400 to-violet-500 w-full h-1/2 sm:(w-1/2 h-full p-0) `,
  css`
    background: linear-gradient(153.75deg, #ec4899 -75.32%, #7c3aed 100%);
    h1 {
      line-height: 32px;
    }
  `,
]);
const RightColumn = tw.section`flex flex-col justify-center items-center bg-slate-white w-full h-1/2 sm:(w-1/2 h-full) `;
const RightColumnContentWrapper = tw.div`flex flex-col justify-center items-center w-full h-full lg:(w-1/2) gap-16 p-16`;
const RightColumnContent = tw.div`flex flex-row justify-center items-center w-full gap-8`;
const HeadingH1 = tw.h1`text-xl lg:(text-3xl) xl:(text-4xl) font-bold text-pink-300 text-center leading-3 sm:(!leading-none)`;
const HeadingH2 = tw.h2`text-xl sm:text-4xl font-bold text-pink-300 text-center whitespace-nowrap text-slate-900`;
const FooterWrapper = tw.div`items-end justify-center`;
