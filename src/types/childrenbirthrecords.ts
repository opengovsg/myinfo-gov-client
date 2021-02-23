import { MyInfoField, StringValue, CodeAndDesc } from "./base"

export type ChildCustomFields = {
  birthcertno: StringValue
  name: StringValue
  hanyupinyinname: StringValue
  aliasname: StringValue
  hanyupinyinaliasname: StringValue
  marriedname: StringValue
  sex: CodeAndDesc
  race: CodeAndDesc
  secondaryrace: CodeAndDesc
  dialect: CodeAndDesc
  lifestatus: CodeAndDesc
  dob: StringValue
  tob: StringValue
}

type ChildBelow21 = ChildCustomFields
type ChildAbove21 = Pick<ChildCustomFields, 'birthcertno'>

export type MyInfoChildrenBirthRecord = MyInfoField<ChildBelow21 | ChildAbove21>
