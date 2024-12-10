import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      ErrorMessages.SHARED.INVALID_CREDENTIALS,
      HttpStatus.UNAUTHORIZED,
      'SHARED_INVALID_CREDENTIALS',
    )
  }
}
