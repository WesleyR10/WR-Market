import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { inviteSubject } from './subjects/invite'
import { organizationSubject } from './subjects/organization'
import { userSubject } from './subjects/user'
import { categorySubject } from './subjects/category'
import { productSubject } from './subjects/product'
import { stockSubject } from './subjects/stock'
import { clientSubject } from './subjects/client'
import { deliverySubject } from './subjects/delivery'
import { reportSubject } from './subjects/report'
import { saleSubject } from './subjects/sale'
import { supplierSubject } from './subjects/supplier'
import { purchaseSubject } from './subjects/purchase'

export * from './models/organization'
export * from './models/category'
export * from './models/product'
export * from './models/user'
export * from './roles'

const appAbilitiesSchema = z.union([
  userSubject,
  organizationSubject,
  inviteSubject,
  productSubject,
  categorySubject,
  stockSubject,
  clientSubject,
  deliverySubject,
  reportSubject,
  saleSubject,
  supplierSubject,
  purchaseSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
