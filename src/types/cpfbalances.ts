import { MyInfoField, MyInfoNotApplicable, NumberValue } from "./base"

type CpfBalances = {
    ma: NumberValue
    oa: NumberValue
    sa: NumberValue
    ra?: NumberValue
  }

export type MyInfoCpfBalances = MyInfoField<CpfBalances> | MyInfoNotApplicable
