import tw, { styled, css } from 'twin.macro';
import {
  Button,
  Heading,
  MumbleLogo,
  Paragraph,
  TextButton,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

export type StartScreen = React.DOMAttributes<HTMLDivElement>;

export const StartScreen: React.FC<StartScreen> = () => {
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
    <LayoutWrapper>
      <LeftColumn>
        <div tw="mb-32">
          <MumbleLogo alignment="vertical" color="white" isNavigation={false} onLogoClick={function noRefCheck() {}} />
        </div>
        <div tw="w-full sm:w-3/4">
          <h1 tw="text-2xl lg:(text-4xl) font-bold text-pink-300 text-center">
            Find out whats new <br /> in <span tw="text-xl font-bold text-slate-white lg:(text-4xl)">#fashion</span>.
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
      </RightColumn>
    </LayoutWrapper>
  );
};

const LayoutWrapper = tw.div`flex flex-col justify-between items-start w-full h-screen sm:(flex-row)`;

const LeftColumn = styled.div(() => [
  tw`flex flex-col justify-center items-center bg-gradient-to-b from-pink-400 to-violet-500 w-full h-2/3 sm:(w-1/2 h-full p-0) `,
  css`
    background: linear-gradient(153.75deg, #ec4899 -75.32%, #7c3aed 100%);
  `,
]);

const RightColumn = tw.div`flex justify-center items-center bg-slate-white w-full h-1/3 sm:(w-1/2 h-full) `;
const RightColumnContentWrapper = tw.div`flex flex-col justify-center items-center w-full lg:(w-1/2) gap-16 p-16`;
