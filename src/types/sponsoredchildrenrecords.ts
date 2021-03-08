import { MyInfoField, StringValue, CodeAndDesc, MyInfoAttribute, MyInfoNotApplicable } from "./base"

export type MyInfoSponsoredChildFull = {
  nric: StringValue
  name: StringValue
  hanyupinyinname: StringValue
  aliasname: StringValue
  hanyupinyinaliasname: StringValue
  marriedname: StringValue
  sex: CodeAndDesc
  race: CodeAndDesc
  secondaryrace: CodeAndDesc
  dialect: CodeAndDesc
  dob: StringValue
  birthcountry: CodeAndDesc
  lifestatus: CodeAndDesc
  residentialstatus: CodeAndDesc
  nationality: CodeAndDesc
  scprgrantdate: StringValue
}

export type MyInfoSponsoredChildBelow21 = MyInfoSponsoredChildFull
export type MyInfoSponsoredChildAbove21 = Pick<MyInfoSponsoredChildFull, 'nric'>

export type MyInfoSponsoredChildrenRecords = Array<MyInfoField<MyInfoSponsoredChildBelow21 | MyInfoSponsoredChildAbove21 | MyInfoNotApplicable>>
export type SponsoredChildrenRecordsScope = `${MyInfoAttribute.SponsoredChildrenRecords}.${keyof MyInfoSponsoredChildFull}`
