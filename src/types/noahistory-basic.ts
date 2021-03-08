import { MyInfoField } from './base'
import { NoaBasic } from './noa-basic'

export type MyInfoNoaHistoryBasic = MyInfoField<{
  noas: NoaBasic[]
}>
