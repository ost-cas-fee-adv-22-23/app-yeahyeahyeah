import { UploadImage } from '@/services';

type TextBoxState = {
  errorMessage: string;
  fileUploadError: string;
  file: UploadImage | null;
};

type TextBoxAction = {
  type: string;
  payload?: string | UploadImage | null;
};

export function reducer(state: TextBoxState, action: TextBoxAction): TextBoxState {
  switch (action.type) {
    case 'set_error_message': {
      return {
        fileUploadError: state.fileUploadError,
        errorMessage: action.payload as string,
        file: state.file,
      };
    }
    case 'clear_error_message': {
      return {
        fileUploadError: state.fileUploadError,
        errorMessage: '',
        file: state.file,
      };
    }
    case 'set_file_upload_error': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: action.payload as string,
        file: state.file,
      };
    }
    case 'clear_file_upload_error': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: '',
        file: state.file,
      };
    }
    case 'set_file': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: state.fileUploadError,
        file: action.payload as UploadImage,
      };
    }
    case 'clear_file': {
      return {
        errorMessage: state.errorMessage,
        fileUploadError: state.fileUploadError,
        file: null,
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
