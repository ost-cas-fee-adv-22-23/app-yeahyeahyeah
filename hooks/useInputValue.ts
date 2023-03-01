import { useState } from 'react';

export const useInputValue = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value || e.target.innerText);
    },
  };
};
