import { MyInfoField } from "./base"
import { NoaFull } from "./noa"

type NoaHistory = {
  noas: NoaFull[]
}

export type MyInfoNoaHistory = MyInfoField<NoaHistory>
