import { MyInfoField, NumberValue } from './base'

type HouseholdIncome = {
  high: NumberValue
  low: NumberValue
}

export type MyInfoHouseholdIncome = MyInfoField<HouseholdIncome>
