import { getCurrentOrg } from '@/auth/auth'

import { getMembersData } from './actions'
import { MembersTable } from './components/MembersTable'

// const membersData = [
//   {
//     id: '1',
//     photo: 'https://randomuser.me/api/portraits/men/32.jpg',
//     name: 'João Silva',
//     email: 'joao.silva@example.com',
//     phone: '(11) 91234-5678',
//     role: 'Administrador',
//     status: 'Ativo',
//     joinedDate: '2023-01-15',
//   },
//   {
//     id: '2',
//     photo: 'https://randomuser.me/api/portraits/women/44.jpg',
//     name: 'Maria Oliveira',
//     email: 'maria.oliveira@example.com',
//     phone: '(21) 92345-6789',
//     role: 'Editor',
//     status: 'Pendente',
//     joinedDate: '2023-03-22',
//   },
//   // Adicione mais membros conforme necessário
// ]

async function MembersPage() {
  const currentOrg = getCurrentOrg()

  if (!currentOrg) {
    return null
  }

  const data = await getMembersData(currentOrg)

  if (!data) {
    return null
  }

  return <MembersTable data={data} />
}
export default MembersPage
