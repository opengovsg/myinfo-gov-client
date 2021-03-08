import { MyInfoSingaporeAddress, MyInfoUnformattedAddress } from './address'
import {
  CodeAndDesc,
  MyInfoAttribute,
  MyInfoField,
  NumberValue,
  StringValue,
} from './base'

type HdbOwnershipCustomFields = {
  noofowners: NumberValue
  address: MyInfoSingaporeAddress | MyInfoUnformattedAddress
  hdbtype: CodeAndDesc
  leasecommencementdate: StringValue
  termoflease: NumberValue
  dateofpurchase: StringValue
  dateofownershiptransfer: StringValue
  loangranted: NumberValue
  originalloanrepayment: NumberValue
  balanceloanrepayment: {
    years: NumberValue
    months: NumberValue
  }
  outstandingloanbalance: NumberValue
  monthlyloaninstalment: NumberValue
}

export type MyInfoHdbOwnership = MyInfoField<HdbOwnershipCustomFields>
export type HdbOwnershipScope = `${MyInfoAttribute.HDBOwnership}.${keyof HdbOwnershipCustomFields}`
