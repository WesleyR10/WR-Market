import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class InvalidTokenError extends AppError {
  constructor() {
    super(
      ErrorMessages.AUTH.INVALID_TOKEN,
      HttpStatus.UNAUTHORIZED,
      'AUTH_INVALID_TOKEN',
    )
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super(ErrorMessages.AUTH.FORBIDDEN, HttpStatus.FORBIDDEN, 'AUTH_FORBIDDEN')
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(ErrorMessages.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN, 'UNAUTHORIZED')
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.AUTH.USER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
    )
  }
}

export class EmailInUseError extends AppError {
  constructor() {
    super(ErrorMessages.AUTH.EMAIL_IN_USE, HttpStatus.CONFLICT, 'EMAIL_IN_USE')
  }
}

export class PhoneInUseError extends AppError {
  constructor() {
    super(ErrorMessages.AUTH.PHONE_IN_USE, 409, 'PHONE_IN_USE')
  }
}

export class NoPasswordError extends AppError {
  constructor() {
    super(ErrorMessages.AUTH.NO_PASSWORD, HttpStatus.BAD_REQUEST, 'NO_PASSWORD')
  }
}
