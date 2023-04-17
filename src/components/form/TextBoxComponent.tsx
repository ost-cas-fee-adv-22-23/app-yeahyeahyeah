import React, { useEffect, useReducer, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { FileRejection } from 'react-dropzone';
import Message from '../../../data/content.json';
import { postMumble, Mumble, UploadImage, postReply, alertService, fetchUser } from '@/services';
import { TextBox, UploadForm } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { reducer } from '@/reducer/textbox-reducer';

type TextBoxComponentProps = {
  id?: string;
  variant: 'write' | 'inline' | 'start';
  mutate: any;
};

export const TextBoxComponent: React.FC<TextBoxComponentProps> = ({ id, variant, mutate }) => {
  const { data: session }: any = useSession();
  const [inputValue, setInputValue] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [state, dispatch] = useReducer(reducer, { errorMessage: '', fileUploadError: '', file: null });

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
    dispatch({ type: 'clear_file' });
  };

  const addText = async () => {
    if (inputValue === '') {
      dispatch({ type: 'set_error_message', payload: Message.alerts.textBox.text });
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
        res = await postReply(id, inputValue, state.file, session?.accessToken);
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
        res = await postMumble(inputValue, state.file, session?.accessToken);
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

  const setTimerForError = () =>
    setTimeout(() => {
      dispatch({ type: 'clear_file_upload_error', payload: '' });
    }, 2000);

  const onDropCallBack = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    fileRejections?.length && dispatch({ type: 'set_file_upload_error', payload: Message.alerts.fileError.text });
    setTimerForError();

    const newFile = acceptedFiles[0];
    if (!newFile) {
      return;
    }

    if (newFile.size > 1024 * 1024 * 5) {
      const fileSizeBytes: number = newFile.size;
      const fileSizeMB = (Math.round(fileSizeBytes / 1024) / 1024).toFixed(1);
      dispatch({ type: 'set_error_message', payload: `${fileSizeMB}: ${Message.alerts.fileError.text}` });
    }

    dispatch({
      type: 'set_file',
      payload: Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      }),
    });

    showModal && setShowModal(false);
  };

  const handleUpload = () => {
    setShowModal(true);
  };

  useEffect(() => {
    inputValue !== '' && state.errorMessage !== '' && dispatch({ type: 'clear_error_message' });
  }, [inputValue, dispatch, state.errorMessage]);

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
          errorMessage: state.errorMessage,
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
        fileUploadError={state.fileUploadError}
      />
    </div>
  );
};
