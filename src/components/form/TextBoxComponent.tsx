import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import debounce from 'lodash.debounce';
import useSWR from 'swr';
import { FileRejection } from 'react-dropzone';
import Message from '../../../data/content.json';
import { postMumble, Mumble, UploadImage, postReply, alertService, fetchUser } from '@/services';
import { TextBox, UploadForm } from '@smartive-education/design-system-component-library-yeahyeahyeah';

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

  const { data: user }: any = useSWR(
    session?.accessToken ? { url: '/api/user', id: session?.user?.id, token: session?.accessToken } : null,
    fetchUser,
    {
      revalidateOnFocus: false,
    }
  );

  const clearFormValues = () => {
    setInputValue('');
    setFile(null);
  };

  const addText = async () => {
    if (inputValue === '') {
      setErrorMessage(Message.alerts.error.text);
      return;
    }

    if (!session?.accessToken) {
      alertService.error(`${Message.alerts.textBox.text}`, {
        autoClose: false,
        keepAfterRouteChange: false,
      });
      clearFormValues();
      return;
    }

    if (id) {
      try {
        res = await postReply(id, inputValue, file, session?.accessToken);
        res && mutate();

        clearFormValues();

        if (!res) {
          throw new Error(Message.alerts.postError.text);
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : Message.alerts.catchError.text);
      }
    } else {
      try {
        res = await postMumble(inputValue, file, session?.accessToken);
        res && mutate();

        clearFormValues();

        if (!res) {
          throw new Error(Message.alerts.postError.text);
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : Message.alerts.postMumbleError.text);
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
      setErrorMessage(`${fileSizeMB}: ${Message.alerts.fileError.text}`);
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
          label: `${Message.contents.textBox.text}`,
          username: user ? user.userName : `${Message.contents.userName.text}`,
          href: user && user.id ? `/profile/${user.id}` : '/landingpage',
          avatar: {
            src: user && user.avatarUrl !== '' ? user.avatarUrl : `${Message.contents.defaultAvatar.image}`,
            alt: user ? user.userName : `${Message.contents.userName.text}`,
            title: user ? user.userName : `${Message.contents.userName.text}`,
            href: user && user.id ? `/profile/${session?.user?.id}` : '/landingpage',
            legacyBehavior: true,
            passHref: true,
            linkComponent: Link,
          },
        }}
        form={{
          name: 'textbox-mumble',
          errorMessage: errorMessage,
          placeholder: `${Message.contents.form.placeholder_1}`,
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
