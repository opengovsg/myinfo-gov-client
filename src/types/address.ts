import { MyInfoField, StringValue, CodeAndDesc } from "./base"


export enum AddressType {
  Singapore = 'SG',
  Unformatted = 'UNFORMATTED'
}

export type SingaporeAddress = {
  type: AddressType.Singapore
  block: StringValue
  building: StringValue
  floor: StringValue
  unit: StringValue
  street: StringValue
  postal: StringValue
  country: CodeAndDesc
}

export type UnformattedAddress = {
  type: AddressType.Unformatted
  line1?: StringValue
  line2?: StringValue
}

export type MyInfoAddress = MyInfoField<SingaporeAddress | UnformattedAddress>
