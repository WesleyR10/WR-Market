import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class StockNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.STOCK.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'STOCK_NOT_FOUND',
    )
  }
}

export class StockCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.STOCK.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'STOCK_CREATE_NOT_ALLOWED',
    )
  }
}

export class StockUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.STOCK.UPDATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'STOCK_UPDATE_NOT_ALLOWED',
    )
  }
}

export class StockDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.STOCK.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'STOCK_DELETE_NOT_ALLOWED',
    )
  }
}

export class StockGetNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.STOCK.GET_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'STOCK_GET_NOT_ALLOWED',
    )
  }
}
