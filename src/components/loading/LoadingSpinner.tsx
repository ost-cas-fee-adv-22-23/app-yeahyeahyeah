import tw, { styled } from 'twin.macro';
import { Repost } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type LoadingSpinnerProps = {
  fill?: string;
  width?: number;
  height?: number;
};

const defaultProps: LoadingSpinnerProps = {
  width: 32,
  height: 32,
};

export const LoadingSpinner = ({ fill, width, height }: LoadingSpinnerProps) => {
  return (
    <LoadingWrapper>
      <ImageIcon>
        <Repost width={width} height={height} fill={fill} />
      </ImageIcon>
    </LoadingWrapper>
  );
};

LoadingSpinner.defaultProps = defaultProps;

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
