import { MyInfoField, StringValue, CodeAndDesc, MyInfoAttribute } from "./base"

type MyInfoChildFull = {
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

export type MyInfoChildBirthRecordBelow21 = MyInfoChildFull
export type MyInfoChildBirthRecordAbove21 = Pick<MyInfoChildFull, 'birthcertno'>

export type MyInfoChildrenBirthRecords = Array<MyInfoField<MyInfoChildBirthRecordBelow21 | MyInfoChildBirthRecordAbove21>>
export type ChildrenBirthRecordsScope = `${MyInfoAttribute.ChildrenBirthRecords}.${keyof MyInfoChildFull}`
