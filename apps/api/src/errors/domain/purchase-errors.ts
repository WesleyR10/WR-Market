import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class PurchaseNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.PURCHASE.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'PURCHASE_NOT_FOUND',
    )
  }
}

export class PurchaseCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.PURCHASE.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'PURCHASE_CREATE_NOT_ALLOWED',
    )
  }
}

export class PurchaseUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.PURCHASE.UPDATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'PURCHASE_UPDATE_NOT_ALLOWED',
    )
  }
}

export class PurchaseDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.PURCHASE.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'PURCHASE_DELETE_NOT_ALLOWED',
    )
  }
}

export class PurchaseGetNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.PURCHASE.GET_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'PURCHASE_GET_NOT_ALLOWED',
    )
  }
}
