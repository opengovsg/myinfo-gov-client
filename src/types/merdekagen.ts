import { MyInfoField, NumberValue, BooleanValue, CodeAndDesc } from './base'

type MerdekaGen = {
  eligibility: BooleanValue
  quantum: NumberValue
  message: CodeAndDesc
}

export type MyInfoMerdekaGen = MyInfoField<MerdekaGen>
