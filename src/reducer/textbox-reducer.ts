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
        fileUploadError: state.fileUploadError,
        errorMessage: action.payload as string,
        file: state.file,
        showModal: state.showModal,
        inputValue: state.inputValue,
      };
    }
    case 'CLEAR_ERROR_MESSAGE': {
      return {
        fileUploadError: state.fileUploadError,
        errorMessage: '',
        file: state.file,
        showModal: state.showModal,
        inputValue: state.inputValue,
      };
    }
    case 'SET_FILE_UPLOAD_ERROR': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: action.payload as string,
        file: state.file,
        showModal: state.showModal,
        inputValue: state.inputValue,
      };
    }
    case 'CLEAR_FILE_UPLOAD_ERROR': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: '',
        file: state.file,
        showModal: state.showModal,
        inputValue: state.inputValue,
      };
    }
    case 'SET_FILE': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: state.fileUploadError,
        file: action.payload as UploadImage,
        showModal: state.showModal,
        inputValue: state.inputValue,
      };
    }
    case 'CLEAR_FILE': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: state.fileUploadError,
        file: null,
        showModal: state.showModal,
        inputValue: state.inputValue,
      };
    }
    case 'SHOW_MODAL': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: state.fileUploadError,
        file: state.file,
        showModal: true,
        inputValue: state.inputValue,
      };
    }
    case 'CLOSE_MODAL': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: state.fileUploadError,
        file: state.file,
        showModal: false,
        inputValue: state.inputValue,
      };
    }
    case 'SET_INPUT_VALUE': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: state.fileUploadError,
        file: state.file,
        showModal: state.showModal,
        inputValue: action.payload as string,
      };
    }
    case 'CLEAR_INPUT_VALUE': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: state.fileUploadError,
        file: state.file,
        showModal: state.showModal,
        inputValue: '',
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
