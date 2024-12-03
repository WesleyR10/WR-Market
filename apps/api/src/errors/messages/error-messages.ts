export const ErrorMessages = {
  SHARED: {
    INVALID_CREDENTIALS: 'Credenciais inválidas',
  },
  AUTH: {
    INVALID_TOKEN: 'Token inválido ou expirado',
    FORBIDDEN: 'Sem permissão para acessar este recurso',
    UNAUTHORIZED: 'Não autorizado',
    USER_NOT_FOUND: 'Usuário não encontrado',
    EMAIL_IN_USE: 'Email já está em uso',
    PHONE_IN_USE: 'Telefone já está em uso',
    NO_PASSWORD: 'Usuário não possui senha cadastrada, use login social'
  },
  ORGANIZATION: {
    NOT_FOUND: 'Organização não encontrada',
    UNAUTHORIZED: 'Você não tem permissão para acessar esta organização',
    DOMAIN_IN_USE: 'Domínio já está em uso por outra organização',
    TRANSFER_NOT_ALLOWED: 'Você não tem permissão para transferir esta organização',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar esta organização',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para excluir esta organização',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar esta organização',
    MEMBER_NOT_FOUND: 'Usuário não é membro desta organização',
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
  CATEGORY: {
    NOT_FOUND: 'Categoria não encontrada',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar categorias',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar esta categoria',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para excluir esta categoria',
  },
  PRODUCT: {
    NOT_FOUND: 'Produto não encontrado',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar produtos',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar este produto',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para excluir este produto',
  },
} as const 