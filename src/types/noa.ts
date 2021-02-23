import { MyInfoField, StringValue, NumberValue } from "./base"

export type NOAFullFields = {
  amount: NumberValue
  yearofassessment: StringValue
  employment: NumberValue
  trade: NumberValue
  rent: NumberValue
  interest: NumberValue
  taxclearance: StringValue
  category: StringValue
}

export type MyInfoNoa = MyInfoField<NOAFullFields>
