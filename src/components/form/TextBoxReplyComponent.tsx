import React, { useEffect, useMemo, useState } from 'react';
import { FileRejection } from 'react-dropzone';
import debounce from 'lodash.debounce';
import { TextBox, UploadForm } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { useSession } from 'next-auth/react';
import { Mumble, UploadImage } from '@/services/qwacker';
import { postReply } from '@/services/postReply';

type TextBoxReplyComponentProps = {
  variant: 'write' | 'inline' | 'start';
  id: string;
  setReply?: React.Dispatch<React.SetStateAction<Mumble | null>>;
};

export const TextBoxReplyComponent: React.FC<TextBoxReplyComponentProps> = ({ id, variant, setReply }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [fileUploadError, setFileUploadError] = useState('');
  const { data: session }: any = useSession();
  const [file, setFile] = useState<UploadImage | null>(null);

  const addText = async () => {
    if (inputValue === '') {
      setErrorMessage('Bitte füllen Sie das Feld aus.');
      return;
    }

    const res = await postReply(id, inputValue, file, session?.accessToken);
    console.log('res', res);
    setInputValue('');
    setReply && setReply(res);
    setFile(null);
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

    const newFile = acceptedFiles[0];
    if (!newFile) {
      return;
    }

    setFile(
      Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      })
    );

    showModal && setShowModal(false);
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
          name: 'textbox-mumble',
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
