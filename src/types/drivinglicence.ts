import {
  MyInfoField,
  StringValue,
  NumberValue,
  CodeAndDesc,
  MyInfoAttribute,
} from './base'

type StartEndDate = Partial<{
  startdate: StringValue
  enddate: StringValue
}>

type PDL = Partial<{
  validity: CodeAndDesc
  expirydate: StringValue
  classes: { class: StringValue }[]
}>

type QDL = Partial<{
  validity: CodeAndDesc
  expirydate: StringValue
  classes: {
    class: StringValue
    issuedate: StringValue
  }[]
}>

type DrivingLicenceCustomFields = Partial<{
  comstatus: CodeAndDesc
  totaldemeritpoints: NumberValue
  suspension: StartEndDate
  disqualification: StartEndDate
  revocation: StartEndDate
  pdl: PDL
  qdl: QDL
  photocardserialno: StringValue
}>

export type MyInfoDrivingLicence = MyInfoField<DrivingLicenceCustomFields>
export type DrivingLicenceScope =
  | `${MyInfoAttribute.DrivingLicence}.${Exclude<
      keyof DrivingLicenceCustomFields,
      'suspension' | 'disqualification' | 'revocation' | 'pdl' | 'qdl'
    >}`
  | `${MyInfoAttribute.DrivingLicence}.${
      | 'suspension'
      | 'disqualification'
      | 'revocation'}.${keyof StartEndDate}`
  | `${MyInfoAttribute.DrivingLicence}.pdl.${keyof PDL}`
  | `${MyInfoAttribute.DrivingLicence}.qdl.${keyof QDL}`
