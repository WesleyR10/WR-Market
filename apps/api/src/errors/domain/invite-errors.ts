import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class InviteNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'INVITE_NOT_FOUND',
    )
  }
}

export class InviteCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'INVITE_CREATE_NOT_ALLOWED',
    )
  }
}

export class InviteDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'INVITE_DELETE_NOT_ALLOWED',
    )
  }
}

export class InviteHierarchyError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.HIERARCHY_ERROR,
      HttpStatus.FORBIDDEN,
      'INVITE_HIERARCHY_ERROR',
    )
  }
}

export class InviteEmailInUseError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.EMAIL_IN_USE,
      HttpStatus.CONFLICT,
      'INVITE_EMAIL_IN_USE',
    )
  }
}

export class InviteMemberExistsError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.MEMBER_EXISTS,
      HttpStatus.CONFLICT,
      'INVITE_MEMBER_EXISTS',
    )
  }
}

export class InviteInvalidRoleError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.INVALID_ROLE,
      HttpStatus.BAD_REQUEST,
      'INVITE_INVALID_ROLE',
    )
  }
}

export class InviteExpiredError extends AppError {
  constructor() {
    super(ErrorMessages.INVITE.EXPIRED, HttpStatus.GONE, 'INVITE_EXPIRED')
  }
}

export class InviteAlreadyAcceptedError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.ALREADY_ACCEPTED,
      HttpStatus.CONFLICT,
      'INVITE_ALREADY_ACCEPTED',
    )
  }
}

export class InviteBelongsToAnotherUserError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.BELONGS_TO_ANOTHER_USER,
      HttpStatus.FORBIDDEN,
      'INVITE_BELONGS_TO_ANOTHER_USER',
    )
  }
}

export class InviteInvalidDomainError extends AppError {
  constructor() {
    super(
      ErrorMessages.INVITE.INVALID_DOMAIN,
      HttpStatus.BAD_REQUEST,
      'INVITE_INVALID_DOMAIN',
    )
  }
}
