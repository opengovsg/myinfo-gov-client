import { MyInfoField, StringValue, NumberValue, BooleanValue } from './base'

type GstVoucher = {
  exclusion: BooleanValue
  signup: BooleanValue
  gstmedisave: NumberValue
  gstregular: NumberValue
  gstspecial: NumberValue
  year: StringValue
}

export type MyInfoGstVoucher = MyInfoField<GstVoucher>
