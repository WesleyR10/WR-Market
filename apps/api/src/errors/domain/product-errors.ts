import { AppError } from '../base/AppError'
import { ErrorMessages } from '../messages/error-messages'
import { HttpStatus } from '../constants/http-status'

export class ProductNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.PRODUCT.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'PRODUCT_NOT_FOUND'
    )
  }
}

export class ProductCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.PRODUCT.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'PRODUCT_CREATE_NOT_ALLOWED' 
    )
  }
}

export class ProductUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.PRODUCT.UPDATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'PRODUCT_UPDATE_NOT_ALLOWED'
    )
  }
}

export class ProductDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.PRODUCT.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'PRODUCT_DELETE_NOT_ALLOWED'
    )
  }
} 