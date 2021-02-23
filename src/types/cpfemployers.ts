import { MyInfoField, StringValue } from "./base"

type CpfEmployer = {
    history: {
      employer: StringValue
      month: StringValue
    }[]
  }

export type MyInfoCpfEmployers = MyInfoField<CpfEmployer>
