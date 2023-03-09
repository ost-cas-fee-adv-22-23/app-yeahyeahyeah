import tw, { styled } from 'twin.macro';
import { Repost } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export const LoadingSpinner = () => {
  return (
    <LoadingWrapper>
      <ImageIcon>
        <Repost width="32" height="32" />
      </ImageIcon>
    </LoadingWrapper>
  );
};

const LoadingWrapper = tw.div`
  flex
	flex-col
  justify-center
	items-center
	p-12
`;

const LoaderIcon = tw`
	flex
	justify-center
	rounded-full
	opacity-50
	animate-spin
`;

const ImageIcon = styled.div(() => [
  tw`
    flex
    justify-center
    items-center
    hover:scale-125
    transition
    duration-300
    ease-in-out
    z-50
		w-48
		h-48
`,
  LoaderIcon,
]);
