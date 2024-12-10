import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class SaleNotFoundError extends AppError {
  constructor() {
    super(ErrorMessages.SALE.NOT_FOUND, HttpStatus.NOT_FOUND, 'SALE_NOT_FOUND')
  }
}

export class SaleCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.SALE.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'SALE_CREATE_NOT_ALLOWED',
    )
  }
}

export class SaleGetNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.SALE.GET_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'SALE_GET_NOT_ALLOWED',
    )
  }
}

export class SaleUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.SALE.UPDATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'SALE_UPDATE_NOT_ALLOWED',
    )
  }
}

export class SaleDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.SALE.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'SALE_DELETE_NOT_ALLOWED',
    )
  }
}
