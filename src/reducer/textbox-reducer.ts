import { UploadImage } from '@/services';

type TextBoxState = {
  errorMessage: string;
  fileUploadError: string;
  file: UploadImage | null;
  showModal: boolean;
  inputValue: string;
};

type TextBoxAction = {
  type: string;
  payload?: string | UploadImage | null | boolean;
};

export function reducer(state: TextBoxState, action: TextBoxAction): TextBoxState {
  switch (action.type) {
    case 'SET_ERROR_MESSAGE': {
      return {
        ...state,
        errorMessage: action.payload as string,
      };
    }
    case 'CLEAR_ERROR_MESSAGE': {
      return {
        ...state,
        errorMessage: '',
      };
    }
    case 'SET_FILE_UPLOAD_ERROR': {
      return {
        ...state,
        fileUploadError: action.payload as string,
      };
    }
    case 'CLEAR_FILE_UPLOAD_ERROR': {
      return {
        ...state,
        fileUploadError: '',
      };
    }
    case 'SET_FILE': {
      return {
        ...state,
        file: action.payload as UploadImage,
      };
    }
    case 'CLEAR_FILE': {
      return {
        ...state,
        file: null,
      };
    }
    case 'SHOW_MODAL': {
      return {
        ...state,
        showModal: true,
      };
    }
    case 'CLOSE_MODAL': {
      return {
        ...state,
        showModal: false,
      };
    }
    case 'SET_INPUT_VALUE': {
      return {
        ...state,
        inputValue: action.payload as string,
      };
    }
    case 'CLEAR_INPUT_VALUE': {
      return {
        ...state,
        inputValue: '',
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
