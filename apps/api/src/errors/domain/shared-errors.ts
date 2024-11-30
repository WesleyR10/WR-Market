import { AppError } from '../base/AppError'
import { ErrorMessages } from '../messages/error-messages'
import { HttpStatus } from '../constants/http-status'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      ErrorMessages.SHARED.INVALID_CREDENTIALS,
      HttpStatus.UNAUTHORIZED,
      'SHARED_INVALID_CREDENTIALS'
    )
  }
} 