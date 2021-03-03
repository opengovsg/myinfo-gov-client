import { MyInfoField, StringValue, CodeAndDesc, MyInfoNotApplicable } from "./base"


export enum MyInfoAddressType {
  Singapore = 'SG',
  Unformatted = 'UNFORMATTED'
}

export type MyInfoSingaporeAddress = {
  type: MyInfoAddressType.Singapore
  block: StringValue
  building: StringValue
  floor: StringValue
  unit: StringValue
  street: StringValue
  postal: StringValue
  country: CodeAndDesc
}

export type MyInfoUnformattedAddress = {
  type: MyInfoAddressType.Unformatted
  line1?: StringValue
  line2?: StringValue
}

export type MyInfoAddress = MyInfoField<MyInfoSingaporeAddress | MyInfoUnformattedAddress> | MyInfoNotApplicable
