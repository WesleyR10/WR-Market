import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class InvalidFileTypeError extends AppError {
  constructor() {
    super(
      ErrorMessages.UPLOAD.INVALID_FILE_TYPE,
      HttpStatus.BAD_REQUEST,
      'INVALID_FILE_TYPE',
    )
  }
}

export class FileTooLargeError extends AppError {
  constructor() {
    super(
      ErrorMessages.UPLOAD.FILE_TOO_LARGE,
      HttpStatus.BAD_REQUEST,
      'FILE_TOO_LARGE',
    )
  }
}
