export const ErrorMessages = {
  AUTH: {
    INVALID_TOKEN: 'Token inválido ou expirado',
    FORBIDDEN: 'Sem permissão para acessar este recurso',
    UNAUTHORIZED: 'Não autorizado',
    USER_NOT_FOUND: 'Usuário não encontrado',
    EMAIL_IN_USE: 'Email já está em uso',
    PHONE_IN_USE: 'Telefone já está em uso',
    NO_PASSWORD: 'Usuário não possui senha cadastrada, use login social'
  },
  CLIENT: {
    NOT_FOUND: 'Cliente não encontrado',
    EMAIL_IN_USE: 'Email já está em uso',
    CPF_IN_USE: 'CPF já está em uso',
    INVALID_PASSWORD: 'Senha atual inválida',
    INVALID_RECOVERY_TOKEN: 'Token de recuperação inválido ou expirado',
  },
  ADDRESS: {
    NOT_FOUND: 'Endereço não encontrado',
    UNAUTHORIZED: 'Você não tem permissão para acessar este endereço',
    MAIN_DELETION_ERROR: 'Não é possível excluir o endereço principal sem ter outro endereço cadastrado',
  },
  SHARED: {
    INVALID_CREDENTIALS: 'Credenciais inválidas',
  }
} as const 