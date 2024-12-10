import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class ClientNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.CLIENT.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'CLIENT_NOT_FOUND',
    )
  }
}

export class EmailInUseError extends AppError {
  constructor() {
    super(
      ErrorMessages.CLIENT.EMAIL_IN_USE,
      HttpStatus.CONFLICT,
      'EMAIL_IN_USE',
    )
  }
}

export class CpfInUseError extends AppError {
  constructor() {
    super(ErrorMessages.CLIENT.CPF_IN_USE, HttpStatus.CONFLICT, 'CPF_IN_USE')
  }
}

export class InvalidPasswordError extends AppError {
  constructor() {
    super(
      ErrorMessages.CLIENT.INVALID_PASSWORD,
      HttpStatus.BAD_REQUEST,
      'INVALID_PASSWORD',
    )
  }
}

export class InvalidRecoveryTokenError extends AppError {
  constructor() {
    super(
      ErrorMessages.CLIENT.INVALID_RECOVERY_TOKEN,
      HttpStatus.BAD_REQUEST,
      'INVALID_RECOVERY_TOKEN',
    )
  }
}
