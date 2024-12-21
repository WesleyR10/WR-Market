import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class CategoryNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.CATEGORY.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'CATEGORY_NOT_FOUND',
    )
  }
}

export class CategoryCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.CATEGORY.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'CATEGORY_CREATE_NOT_ALLOWED',
    )
  }
}

export class CategoryUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.CATEGORY.UPDATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'CATEGORY_UPDATE_NOT_ALLOWED',
    )
  }
}

export class CategoryDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.CATEGORY.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'CATEGORY_DELETE_NOT_ALLOWED',
    )
  }
}

export class CategoryNotBelongsToOrganizationError extends AppError {
  constructor() {
    super(
      ErrorMessages.CATEGORY.NOT_BELONGS_TO_ORGANIZATION,
      HttpStatus.BAD_REQUEST,
      'CATEGORY_NOT_BELONGS_TO_ORGANIZATION',
    )
  }
}
