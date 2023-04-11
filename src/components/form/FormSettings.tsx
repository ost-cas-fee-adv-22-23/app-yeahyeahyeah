import React, { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import Message from '../../../data/content.json';
import { Button, InputForm } from '@smartive-education/design-system-component-library-yeahyeahyeah';

type FormSettingsProps = {
  handleClose: () => void;
};

export const FormSettings: React.FC<FormSettingsProps> = ({ handleClose }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePressEnter = () => {
    if (inputValue === '') {
      setErrorMessage(`${Message.alerts.error.text}`);
      return;
    }
    setInputValue('');
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

  return (
    <form>
      <InputForm
        name="settings-firstname"
        key={'settings-firstname'}
        label="Name und Vorname"
        editType={'input'}
        placeholder={`${Message.contents.form.placeholder_2}`}
        required={true}
        autoComplete={'off'}
        setInputValue={setInputValue}
        inputValue={inputValue}
        errorMessage={errorMessage}
        onPressEnter={handlePressEnter}
        data-testid={'name'}
      />
      <InputForm
        name="settings-email"
        key={'settings-email'}
        label="E-Mail"
        editType={'input'}
        placeholder={`${Message.contents.form.placeholder_2}`}
        required={true}
        autoComplete={'off'}
        setInputValue={setInputValue}
        inputValue={inputValue}
        errorMessage={errorMessage}
        onPressEnter={handlePressEnter}
        data-testid={'email'}
      />
      <div tw="flex flex-col sm:flex-row justify-between items-center gap-16">
        <Button label="Abbrechen" icon="cancel" color="slate" width="full" onClick={handleClose} />
        <Button label="Speichern" icon="send" color="violet" width="full" onClick={() => console.log('save settings')} />
      </div>
    </form>
  );
};
