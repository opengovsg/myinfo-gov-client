import { MyInfoField, StringValue, NumberValue } from "./base"

export type NoaBasic = {
  amount: NumberValue
  yearofassessment: StringValue
}

export type MyInfoNoaBasic = MyInfoField<NoaBasic>
