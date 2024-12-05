import { AppError } from '../base/AppError'
import { ErrorMessages } from '../messages/error-messages'
import { HttpStatus } from '../constants/http-status'

export class SupplierNotFoundError extends AppError {
  constructor() {
    super(
      ErrorMessages.SUPPLIER.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      'SUPPLIER_NOT_FOUND'
    )
  }
}

export class SupplierCreateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.SUPPLIER.CREATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'SUPPLIER_CREATE_NOT_ALLOWED'
    )
  }
}

export class SupplierUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.SUPPLIER.UPDATE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'SUPPLIER_UPDATE_NOT_ALLOWED'
    )
  }
}

export class SupplierDeleteNotAllowedError extends AppError {
  constructor() {
    super(
      ErrorMessages.SUPPLIER.DELETE_NOT_ALLOWED,
      HttpStatus.FORBIDDEN,
      'SUPPLIER_DELETE_NOT_ALLOWED'
    )
  }
} 