import { MyInfoField, StringValue, CodeAndDesc, MyInfoAttribute, MyInfoNotApplicable } from "./base"

export type SponsoredChildFull = {
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

export type SponsoredChildBelow21 = SponsoredChildFull
export type SponsoredChildAbove21 = Pick<SponsoredChildFull, 'nric'>

export type MyInfoSponsoredChildrenRecords = Array<MyInfoField<SponsoredChildBelow21 | SponsoredChildAbove21 | MyInfoNotApplicable>>
export type SponsoredChildrenRecordsScope = `${MyInfoAttribute.SponsoredChildrenRecords}.${keyof SponsoredChildFull}`
