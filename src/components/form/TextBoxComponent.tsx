import React, { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { FileRejection } from 'react-dropzone';
import debounce from 'lodash.debounce';
import { TextBox, UploadForm } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { postMumble } from '@/services/postMumble';
import { useSession } from 'next-auth/react';
import { Mumble, UploadImage } from '@/services/qwacker';
import { postReply } from '@/services/postReply';
import { alertService, fetchUser } from '@/services';
import Link from 'next/link';

type TextBoxComponentProps = {
  id?: string;
  variant: 'write' | 'inline' | 'start';
  mutate: any;
  data: any;
};

export const TextBoxComponent: React.FC<TextBoxComponentProps> = ({ id, variant, mutate, data }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [fileUploadError, setFileUploadError] = useState('');
  const { data: session }: any = useSession();
  const [file, setFile] = useState<UploadImage | null>(null);
  let res: Mumble | null = null;

  const { data: user }: any = useSWR({ url: '/api/user', id: session?.user?.id, token: session?.accessToken }, fetchUser, {
    revalidateOnFocus: false,
  });

  const clearFormValues = () => {
    setInputValue('');
    setFile(null);
  };

  const addText = async () => {
    if (inputValue === '') {
      setErrorMessage('Bitte füllen Sie das Feld aus.');
      return;
    }

    if (!session?.accessToken) {
      alertService.error('Bitte melde dich an, sonst kannst du nicht posten!!', {
        autoClose: false,
        keepAfterRouteChange: false,
      });
      clearFormValues();
      return;
    }

    if (id) {
      try {
        res = await postReply(id, inputValue, file, session?.accessToken);
        res && mutate({ ...data, replies: [res, ...data?.replies] });

        clearFormValues();

        if (!res) {
          throw new Error('Something was not okay with posting a reply.');
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Could not post a reply.');
      }
    } else {
      try {
        res = await postMumble(inputValue, file, session?.accessToken);
        res && mutate();

        clearFormValues();

        if (!res) {
          throw new Error('Something was not okay with posting a mumble.');
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Could not post a mumble.');
      }
    }
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
    fileRejections?.length && setFileUploadError(fileRejections[0].errors[0].message);
    setTimerForError();

    const newFile = acceptedFiles[0];
    if (!newFile) {
      return;
    }

    if (newFile.size > 1024 * 1024 * 5) {
      const fileSizeBytes: number = newFile.size;
      const fileSizeMB = (Math.round(fileSizeBytes / 1024) / 1024).toFixed(1);
      setErrorMessage(`Deine Datei ist ${fileSizeMB} MB gross, sollte aber max. 5 MB sein.`);
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
          username: user ? user.userName : 'username',
          href: session?.user?.id || `/landingpage`,
          avatar: {
            src: user && user.avatarUrl !== '' ? user.avatarUrl : '/avatar_default.png/',
            alt: user ? user.userName : 'username',
            title: user ? user.userName : 'username',
            href: session?.user?.id ? `/profile/${session?.user?.id}` : '/',
            legacyBehavior: true,
            passHref: true,
            linkComponent: Link,
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
