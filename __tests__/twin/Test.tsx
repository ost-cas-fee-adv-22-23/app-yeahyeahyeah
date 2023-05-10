import tw, { styled } from 'twin.macro';

const StyledImportComponent = styled.h1(() => [tw`bg-slate-500`]);
const TwImportComponent = tw.div`bg-slate-500`;
const TwPropComponent = ({ text }: { text: string }) => <div tw="bg-slate-500">{text}</div>;

export default function Test({ text }: { text: string }) {
  return (
    <>
      <StyledImportComponent />
      <TwImportComponent />
      <TwPropComponent text={text} />
    </>
  );
}
