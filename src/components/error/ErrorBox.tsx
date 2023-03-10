import tw from 'twin.macro';

type ErrorBoxProps = {
  message: string;
};

export const ErrorBox = ({ message }: ErrorBoxProps) => {
  return (
    <ErrorBoxWrapper>
      <MessageStyles>{message}</MessageStyles>
    </ErrorBoxWrapper>
  );
};

const ErrorBoxWrapper = tw.div`bg-pink-500 p-8 mb-16 rounded-md flex justify-center`;
const MessageStyles = tw.p`text-slate-white font-medium`;
