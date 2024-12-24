import { getCurrentOrg } from '@/auth/auth'

import { getMembersData } from './actions'
import { MembersTable } from './components/MembersTable'

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
