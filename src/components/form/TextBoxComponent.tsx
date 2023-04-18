import React, { useEffect, useReducer } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { FileRejection } from 'react-dropzone';
import Message from '../../../data/content.json';
import { postMumble, Mumble, postReply, alertService, fetchUser } from '@/services';
import { TextBox, UploadForm } from '@smartive-education/design-system-component-library-yeahyeahyeah';
import { reducer } from '@/reducer/textbox-reducer';

type TextBoxComponentProps = {
  id?: string;
  variant: 'write' | 'inline' | 'start';
  mutate: any;
};

export const TextBoxComponent: React.FC<TextBoxComponentProps> = ({ id, variant, mutate }) => {
  const { data: session }: any = useSession();
  const [state, dispatch] = useReducer(reducer, {
    errorMessage: '',
    fileUploadError: '',
    file: null,
    showModal: false,
    inputValue: '',
  });

  let res: Mumble | null = null;

  const { data: user }: any = useSWR(
    session?.accessToken ? { url: '/api/user', id: session?.user?.id, token: session?.accessToken } : null,
    fetchUser,
    {
      revalidateOnFocus: false,
    }
  );

  const addText = async () => {
    if (state.inputValue === '') {
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: Message.alerts.textBox.text });
      return;
    }

    if (!session?.accessToken) {
      alertService.error(`${Message.alerts.textBox.text}`, {
        autoClose: false,
        keepAfterRouteChange: false,
      });
      dispatch({ type: 'CLEAR_FORM_VALUES' });
      return;
    }

    if (id) {
      try {
        res = await postReply(id, state.inputValue, state.file, session?.accessToken);
        res && mutate();

        dispatch({ type: 'CLEAR_FORM_VALUES' });

        if (!res) {
          throw new Error(Message.alerts.postError.text);
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : Message.alerts.catchError.text);
      }
    } else {
      try {
        res = await postMumble(state.inputValue, state.file, session?.accessToken);
        res && mutate();

        dispatch({ type: 'CLEAR_FORM_VALUES' });

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
      dispatch({ type: 'CLEAR_FILE_UPLOAD_ERROR', payload: '' });
    }, 2000);

  const onDropCallBack = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    fileRejections?.length && dispatch({ type: 'SET_FILE_UPLOAD_ERROR', payload: Message.alerts.fileTypeError.text });
    setTimerForError();

    const newFile = acceptedFiles[0];
    if (!newFile) {
      return;
    }

    if (newFile.size > 1024 * 1024 * 5) {
      const fileSizeBytes: number = newFile.size;
      const fileSizeMB = (Math.round(fileSizeBytes / 1024) / 1024).toFixed(1);
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: `${fileSizeMB}: ${Message.alerts.fileError.text}` });
    }

    dispatch({
      type: 'SET_FILE',
      payload: Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      }),
    });

    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleUpload = () => {
    dispatch({ type: 'SHOW_MODAL' });
  };

  useEffect(() => {
    state.inputValue !== '' && state.errorMessage !== '' && dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
  }, [state.inputValue, dispatch, state.errorMessage]);

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
        dispatch={dispatch}
        inputValue={state.inputValue}
        sendCallback={addText}
        uploadCallback={handleUpload}
      />
      <UploadForm
        onDropCallBack={onDropCallBack}
        showModal={state.showModal}
        dispatch={dispatch}
        fileUploadError={state.fileUploadError}
      />
    </div>
  );
};
