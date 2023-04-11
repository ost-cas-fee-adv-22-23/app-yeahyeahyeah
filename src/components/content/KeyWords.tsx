import tw from 'twin.macro';
import Keyword from '../../../data/content.json';

const KeyWords = () => {
  return (
    <SliderWrapper>
      <KeywordWrapper tw="animate-keyword flex justify-start">
        {`${Keyword.contents.keyword.word_1}`}
        <span tw="text-pink-300">.</span>
      </KeywordWrapper>
      <KeywordWrapper>
        {`${Keyword.contents.keyword.word_2}`}
        <span tw="text-pink-300">.</span>
      </KeywordWrapper>
      <KeywordWrapper>
        {`${Keyword.contents.keyword.word_3}`}
        <span tw="text-pink-300">.</span>
      </KeywordWrapper>
    </SliderWrapper>
  );
};

export default KeyWords;

const SliderWrapper = tw.span`inline-block relative top-6 sm:(top-[10px]) h-[32px] md:(h-[30px]) lg:(h-[50px]) overflow-hidden text-slate-white`;
const KeywordWrapper = tw.div`text-slate-white h-[50px] mb-[50px] pb-12 text-left`;
