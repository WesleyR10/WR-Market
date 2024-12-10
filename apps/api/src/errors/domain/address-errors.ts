import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class AddressNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.ADDRESS.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'ADDRESS_NOT_FOUND',
    )
  }
}

export class AddressUnauthorizedError extends AppError {
  constructor() {
    super(ErrorMessages.ADDRESS.UNAUTHORIZED, 403, 'ADDRESS_UNAUTHORIZED')
  }
}

export class AddressMainDeletionError extends AppError {
  constructor() {
    super(
      ErrorMessages.ADDRESS.MAIN_DELETION_ERROR,
      400,
      'ADDRESS_MAIN_DELETION_ERROR',
    )
  }
}
