import { MyInfoField, StringValue, NumberValue } from "./base"

type CpfContributions = {
    history: {
      employer: StringValue
      date: StringValue
      month: StringValue
      amount: NumberValue
    }[]
  }

export type MyInfoCpfContributions = MyInfoField<CpfContributions>
