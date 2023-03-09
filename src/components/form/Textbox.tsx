import React, { useEffect, useMemo, useState } from 'react';
import { FileRejection } from 'react-dropzone';
import debounce from 'lodash.debounce';
import { TextBox, UploadForm } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { postMumble } from '@/postMumble';
import { useSession } from 'next-auth/react';

type TextBoxComponentProps = {
  variant: 'write' | 'inline' | 'start';
};

export const TextBoxComponent: React.FC<TextBoxComponentProps> = ({ variant }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [fileUploadError, setFileUploadError] = useState('');
  const { data: session }: any = useSession();

  const addText = async () => {
    if (inputValue === '') {
      setErrorMessage('Bitte füllen Sie das Feld aus.');
      return;
    }

    const res = await postMumble(inputValue, null, session?.accessToken);
    console.log('res', res);
    setInputValue('');
  };

  const setErrorDebounced = useMemo(
    () =>
      debounce(() => {
        setErrorMessage('');
      }, 100),
    []
  );

  const setTimerForError = () =>
    setTimeout(() => {
      setFileUploadError('');
    }, 2000);

  const onDropCallBack = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    console.log('acceptedFiles, fileRejections', acceptedFiles, fileRejections);
    fileRejections?.length && setFileUploadError(fileRejections[0].errors[0].message);
    setTimerForError();
  };

  const handleUpload = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (inputValue !== '') {
      setErrorDebounced();
    }
  }, [inputValue, setErrorDebounced]);

  return (
    <div tw="mb-16">
      <TextBox
        variant={variant}
        user={{
          label: 'Hey, was läuft?',
          avatar: {
            src: 'https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif',
            alt: 'Family Guy goes Mumble',
          },
        }}
        form={{
          errorMessage: errorMessage,
          placeholder: 'Deine Meinung zählt ...',
        }}
        setInputValue={setInputValue}
        inputValue={inputValue}
        sendCallback={addText}
        uploadCallback={handleUpload}
      />
      <UploadForm
        onDropCallBack={onDropCallBack}
        showModal={showModal}
        setShowModal={setShowModal}
        fileUploadError={fileUploadError}
      />
    </div>
  );
};
