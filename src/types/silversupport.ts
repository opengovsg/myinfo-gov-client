import { MyInfoField, StringValue, BooleanValue } from './base'

type SilverSupport = {
  eligibility: BooleanValue
  amount: StringValue
  year: StringValue
}

export type MyInfoSilverSupport = MyInfoField<SilverSupport>
