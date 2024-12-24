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
    NO_PASSWORD: 'Usuário não possui senha cadastrada, use login social',
    GOOGLE_AUTH_FAILED: 'Falha na autenticação com Google',
    GOOGLE_EMAIL_REQUIRED: 'Email do Google é obrigatório para autenticação',
  },
  ORGANIZATION: {
    NOT_FOUND: 'Organização não encontrada',
    UNAUTHORIZED: 'Você não tem permissão para acessar esta organização',
    DOMAIN_IN_USE: 'Domínio já está em uso por outra organização',
    TRANSFER_NOT_ALLOWED:
      'Você não tem permissão para transferir esta organização',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar esta organização',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para excluir esta organização',
    UPDATE_NOT_ALLOWED:
      'Você não tem permissão para atualizar esta organização',
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
    MAIN_DELETION_ERROR:
      'Não é possível excluir o endereço principal sem ter outro endereço cadastrado',
  },
  CATEGORY: {
    NOT_FOUND: 'Categoria não encontrada',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar categorias',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar esta categoria',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para excluir esta categoria',
    NOT_BELONGS_TO_ORGANIZATION: 'Categoria não pertence à esta organização',
  },
  PRODUCT: {
    NOT_FOUND: 'Produto não encontrado',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar produtos',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar este produto',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para excluir este produto',
    HAS_RELATIONS:
      'Produto não pode ser excluído pois possui vendas ou compras associadas',
  },
  SUPPLIER: {
    NOT_FOUND: 'Fornecedor não encontrado',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar fornecedores',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar este fornecedor',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para excluir este fornecedor',
    GET_NOT_ALLOWED: 'Você não tem permissão para acessar este fornecedor',
  },
  SALE: {
    NOT_FOUND: 'Venda não encontrada',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar vendas',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar esta venda',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para excluir esta venda',
    GET_NOT_ALLOWED: 'Você não tem permissão para acessar esta venda',
  },
  STOCK: {
    NOT_FOUND: 'Estoque não encontrado',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar estoques',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar este estoque',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para deletar este estoque',
    GET_NOT_ALLOWED: 'Você não tem permissão para acessar este estoque',
  },
  PURCHASE: {
    NOT_FOUND: 'Compra não encontrada',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para criar esta compra',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar esta compra',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para deletar esta compra',
    GET_NOT_ALLOWED: 'Você não tem permissão para acessar esta compra',
  },
  MEMBER: {
    NOT_FOUND: 'Membro não encontrado',
    GET_NOT_ALLOWED: 'Você não tem permissão para visualizar membros',
    CREATE_NOT_ALLOWED: 'Você não tem permissão para adicionar membros',
    UPDATE_NOT_ALLOWED: 'Você não tem permissão para atualizar este membro',
    DELETE_NOT_ALLOWED: 'Você não tem permissão para remover este membro',
    EMAIL_REQUIRED: 'Email do membro é obrigatório',
  },
} as const
