import { MyInfoField, StringValue } from './base'

type MyInfoPhoneNumberCustomFields = {
  prefix: StringValue
  areacode: StringValue
  nbr: StringValue
}

export type MyInfoPhoneNumber = MyInfoField<MyInfoPhoneNumberCustomFields>
