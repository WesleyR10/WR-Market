import { AppError } from '../base/AppError'
import { HttpStatus } from '../constants/http-status'
import { ErrorMessages } from '../messages/error-messages'

export class RoleHierarchyError extends AppError {
  constructor() {
    super(
      ErrorMessages.ROLE.HIERARCHY_ERROR,
      HttpStatus.FORBIDDEN,
      'ROLE_HIERARCHY_ERROR',
    )
  }
}
