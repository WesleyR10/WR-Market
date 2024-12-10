import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class OrganizationNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.ORGANIZATION.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'ORGANIZATION_NOT_FOUND',
    )
  }
}

export class OrganizationUnauthorizedError extends AppError {
  constructor() {
    super(
      ErrorMessages.ORGANIZATION.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED,
      'ORGANIZATION_UNAUTHORIZED',
    )
  }
}

export class OrganizationDomainInUseError extends AppError {
  constructor() {
    super(
      ErrorMessages.ORGANIZATION.DOMAIN_IN_USE,
      HttpStatus.CONFLICT,
      'ORGANIZATION_DOMAIN_IN_USE',
    )
  }
}

export class OrganizationCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.ORGANIZATION.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'ORGANIZATION_CREATE_NOT_ALLOWED',
    )
  }
}

export class OrganizationTransferNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.ORGANIZATION.TRANSFER_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'ORGANIZATION_TRANSFER_NOT_ALLOWED',
    )
  }
}

export class OrganizationMemberNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.ORGANIZATION.MEMBER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'ORGANIZATION_MEMBER_NOT_FOUND',
    )
  }
}

export class OrganizationDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.ORGANIZATION.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'ORGANIZATION_DELETE_NOT_ALLOWED',
    )
  }
}

export class OrganizationUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.ORGANIZATION.UPDATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'ORGANIZATION_UPDATE_NOT_ALLOWED',
    )
  }
}
