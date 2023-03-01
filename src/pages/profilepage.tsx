import React, { useEffect, useMemo, useState } from 'react';
import {
  Switch,
  Container,
  Heading,
  TextBox,
  UploadForm,
  UserRecommendedProps,
  UserRecommended,
  IconLink,
} from '@smartive-education/design-system-component-library-yeahyeahyeah';
import debounce from 'lodash.debounce';
import { FileRejection } from 'react-dropzone';
import Link from 'next/link';

export default function Profilepage() {
  const [posts, setPosts] = useState(['']);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [fileUploadError, setFileUploadError] = useState('');

  const setTimerForError = () =>
    setTimeout(() => {
      setFileUploadError('');
    }, 2000);

  const onDropCallBack = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    console.log('acceptedFiles, fileRejections', acceptedFiles, fileRejections);
    fileRejections?.length && setFileUploadError(fileRejections[0].errors[0].message);
    setTimerForError();
  };

  const setErrorDebounced = useMemo(
    () =>
      debounce(() => {
        setErrorMessage('');
      }, 100),
    []
  );

  useEffect(() => {
    if (inputValue !== '') {
      setErrorDebounced();
    }
  }, [inputValue, setErrorDebounced]);

  const addText = () => {
    if (inputValue === '') {
      setErrorMessage('Bitte füllen Sie das Feld aus.');
      return;
    }

    if (posts[0] === '') {
      setPosts([inputValue]);
      setInputValue('');
      return;
    }
    setPosts([...posts, inputValue]);
    setInputValue('');
  };

  const handleUpload = () => {
    setShowModal(true);
  };

  const props: UserRecommendedProps = {
    label: 'Display Name',
    avatar: {
      alt: 'Alter Tag',
      onImageClick: () => console.log('image clicked'),
      src: 'https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif',
    },
    btn: { label: 'Follow', onClick: () => console.log('btn clicked') },
  };

  const users = Array(12)
    .fill('user')
    .map((u, i) => (
      <div tw="flex-[30%]" key={i}>
        <UserRecommended {...props}>
          <IconLink label="User" type="username" color="violet" href="/" legacyBehavior passHref linkComponent={Link} />
        </UserRecommended>
      </div>
    ));

  return (
    <>
      <Container layout="plain">
        <UploadForm
          onDropCallBack={onDropCallBack}
          showModal={showModal}
          setShowModal={setShowModal}
          fileUploadError={fileUploadError}
        />

        <Switch
          options={[
            {
              label: 'Deine Mumbles',
              value: 'mumbles',
            },
            {
              label: 'Deine Likes',
              value: 'likes',
            },
          ]}
          value="mumbles"
          fCallBack={(value: string) => console.log(`${value} clicked`)}
        />

        <Heading tag="h3" size="default" label="Empfohlene User" mbSpacing="16" color="dark" />
        <div tw="flex flex-row flex-wrap gap-12 mb-32">{users}</div>
        <div tw="mb-32">
          <Heading tag="h3" size="default" label="Empfohlene Mumbles" mbSpacing="16" color="dark" />
          <TextBox
            variant="write"
            user={{
              label: 'Hey, was läuft?',
              avatar: {
                src: 'https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif',
                alt: 'Family Guy goes Mumble',
                onImageClick: () => console.log('avatar clicked'),
              },
            }}
            form={{
              errorMessage: errorMessage,
              placeholder: 'Hast du uns etwas mitzuteilen?',
            }}
            setInputValue={setInputValue}
            inputValue={inputValue}
            sendCallback={addText}
            uploadCallback={handleUpload}
          />
        </div>
      </Container>
    </>
  );
}
