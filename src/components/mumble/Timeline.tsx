import React from 'react';
import { FetchMumbles } from '@/types/fallback';
import { Button, Container, Heading } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { KeyedMutator } from 'swr';
import tw from 'twin.macro';
import { WelcomeText } from '../content/WelcomeText';
import { Alert } from '../alert/Alert';
import { TextBoxComponent } from '../form/TextBoxComponent';
import { Hashtag } from './Hashtag';

type TimelineProps = {
  data: FetchMumbles[];
  mutate: KeyedMutator<FetchMumbles[]>;
  checkForNewMumbles: boolean;
  quantityNewMumbles: string;
  handleRefreshPage: () => void;
  renderMumbles: () => JSX.Element;
  hashtag?: string;
  creator?: { id: string };
};

export const Timeline: React.FC<TimelineProps> = ({
  data,
  mutate,
  checkForNewMumbles,
  quantityNewMumbles,
  handleRefreshPage,
  renderMumbles,
  hashtag,
  creator,
}) => {
  return (
    <>
      {!hashtag && checkForNewMumbles && (
        <MumbleMessageBox>
          <Button label={quantityNewMumbles} color="gradient" onClick={handleRefreshPage} size="small" width="full" />
        </MumbleMessageBox>
      )}
      <Container layout="plain">
        {!hashtag && !creator && (
          <>
            <WelcomeText />
            <Alert />
            <TextBoxComponent variant="write" mutate={mutate} data={data} />
          </>
        )}
        {hashtag && (
          <>
            <div tw="mb-16 mx-16">
              <Heading label="Latest Hashtags..." color="violet" tag="h1" size="default" mbSpacing="8" />
              <Heading label="...used by other users" color="light" tag="h2" size="xlarge" mbSpacing="32" />
            </div>
            <div tw="flex flex-wrap bg-slate-white transform duration-500 bg-slate-100 rounded-xl p-16 sm:p-32 mb-32 gap-8 min-h-[280px]">
              <Hashtag size="xlarge" hashtag={hashtag} />
            </div>
          </>
        )}

        {renderMumbles()}
      </Container>
    </>
  );
};

const MumbleMessageBox = tw.div`animate-bounce fixed top-[110px] mx-auto z-50 hover:(animate-none)`;
