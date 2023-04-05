import tw from 'twin.macro';

const KeyWords: React.FC = () => {
  return (
    <SliderWrapper>
      <KeywordWrapper tw="animate-keyword flex justify-start">
        #CAS<span tw="text-pink-300">.</span>
      </KeywordWrapper>
      <KeywordWrapper>
        #Frontend<span tw="text-pink-300">.</span>
      </KeywordWrapper>
      <KeywordWrapper>
        #Engineering<span tw="text-pink-300">.</span>
      </KeywordWrapper>
    </SliderWrapper>
  );
};

export default KeyWords;

const SliderWrapper = tw.span`inline-block relative top-6 sm:(top-[10px]) h-[32px] md:(h-[30px]) lg:(h-[50px]) overflow-hidden text-slate-white`;
const KeywordWrapper = tw.div`text-slate-white h-[50px] mb-[50px] pb-12 text-left`;
