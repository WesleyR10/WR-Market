import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class MemberNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.MEMBER.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'MEMBER_NOT_FOUND',
    )
  }
}

export class MemberGetNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.MEMBER.GET_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'MEMBER_GET_NOT_ALLOWED',
    )
  }
}

export class MemberCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.MEMBER.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'MEMBER_CREATE_NOT_ALLOWED',
    )
  }
}

export class MemberUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.MEMBER.UPDATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'MEMBER_UPDATE_NOT_ALLOWED',
    )
  }
}

export class MemberDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.MEMBER.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'MEMBER_DELETE_NOT_ALLOWED',
    )
  }
}

export class MemberEmailRequiredError extends AppError {
  constructor() {
    super(
      ErrorMessages.MEMBER.EMAIL_REQUIRED,
      HttpStatus.BAD_REQUEST,
      'MEMBER_EMAIL_REQUIRED',
    )
  }
}
