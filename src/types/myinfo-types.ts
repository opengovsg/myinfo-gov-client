import { MyInfoAddress } from "./address"
import { MyInfoField, StringValue, NumberValue, BooleanValue, BasicField, FieldWithCodeAndDesc } from "./base"
import { MyInfoChildrenBirthRecord, ChildCustomFields } from "./childrenbirthrecords"
import { MyInfoHdbOwnership } from "./hdbownership"
import { MyInfoHouseholdIncome } from "./householdincome"
import { MyInfoPhoneNumber } from "./mobileno"
import { MyInfoVehicle, MyInfoVehicleCustomFields } from "./vehicles"
import { MyInfoOccupation } from "./occupation"
import { MyInfoOwnerPrivate } from "./ownerprivate"
import { MyInfoSponsoredChildrenRecord, SponsoredChildCustomFields } from "./sponsoredchildrenrecords"
import { MyInfoDrivingLicence, DrivingLicenceCustomFields, StartEndDate, PDL, QDL } from "./drivinglicence"
import { MerdekaGen } from "./merdekagen"
import { MyInfoSilverSupport } from "./silversupport"

export type GSTVoucher = MyInfoField<{
  exclusion: BooleanValue
  signup: BooleanValue
  gstmedisave: NumberValue
  gstregular: NumberValue
  gstspecial: NumberValue
  year: StringValue
}>

type NOABasicFields = {
  amount: NumberValue
  yearofassessment: StringValue
}

export type NOABasic = MyInfoField<NOABasicFields>

type NOAFullFields = {
  amount: NumberValue
  yearofassessment: StringValue
  employment: NumberValue
  trade: NumberValue
  rent: NumberValue
  interest: NumberValue
  taxclearance: StringValue
  category: StringValue
}

export type NOAFull = MyInfoField<NOAFullFields>

export type NOAHistoryBasic = MyInfoField<{
  noas: NOABasicFields[]
}>

export type NOAHistoryFull = MyInfoField<{
  noas: NOAFullFields[]
}>

export type CPFContributions = MyInfoField<{
  history: {
    employer: StringValue
    date: StringValue
    month: StringValue
    amount: NumberValue
  }[]
}>

export type CPFEmployers = MyInfoField<{
  history: {
    employer: StringValue
    month: StringValue
  }[]
}>

export type CPFBalances = MyInfoField<{
  ma: NumberValue
  oa: NumberValue
  sa: NumberValue
  ra?: NumberValue
}>

/**
 * Keys of data returned by Person API.
 */
export enum MyInfoAttribute {
  UinFin = 'uinfin',
  Name = 'name',
  HanYuPinYinName = 'hanyupinyinname',
  AliasName = 'aliasname',
  HanYuPinYinAliasName = 'hanyupinyinaliasname',
  MarriedName = 'marriedname',
  Sex = 'sex',
  Race = 'race',
  SecondaryRace = 'secondaryrace',
  Dialect = 'dialect',
  Nationality = 'nationality',
  DateOfBirth = 'dob',
  BirthCountry = 'birthcountry',
  ResidentialStatus = 'residentialstatus',
  PassportNumber = 'passportnumber',
  PassportExpiryDate = 'passportexpirydate',
  RegisteredAddress = 'regadd',
  HousingType = 'housingtype',
  HDBType = 'hdbtype',
  HDBOwnership = 'hdbownership',
  OwnerPrivate = 'ownerprivate',
  Email = 'email',
  MobileNo = 'mobileno',
  MaritalStatus = 'marital',
  MarriageCertNumber = 'marriagecertno',
  CountryOfMarriage = 'countryofmarriage',
  MarriageDate = 'marriagedate',
  DivorceDate = 'divorcedate',
  ChildrenBirthRecords = 'childrenbirthrecords',
  SponsoredChildrenRecords = 'sponsoredchildrenrecords',
  Occupation = 'occupation',
  Employment = 'employment',
  PassType = 'passtype',
  PassStatus = 'passstatus',
  PassExpiryDate = 'passexpirydate',
  EmploymentSector = 'employmentsector',
  HouseholdIncome = 'householdincome',
  Vehicles = 'vehicles',
  DrivingLicence = 'drivinglicence',
  MerdekaGen = 'merdekagen',
  SilverSupport = 'silversupport',
  GSTVoucher = 'gstvoucher',
  NOABasic = 'noa-basic',
  NOA = 'noa',
  NOAHistoryBasic = 'noahistory-basic',
  NOAHistory = 'noahistory',
  CPFContributions = 'cpfcontributions',
  CPFEmployers = 'cpfemployers',
  CPFBalances = 'cpfbalances',
}

type IPersonFull = {
  uinfin: BasicField
  name: BasicField
  hanyupinyinname: BasicField
  aliasname: BasicField
  hanyupinyinaliasname: BasicField
  marriedname: BasicField
  sex: FieldWithCodeAndDesc
  race: FieldWithCodeAndDesc
  secondaryrace: FieldWithCodeAndDesc
  dialect: FieldWithCodeAndDesc
  nationality: FieldWithCodeAndDesc
  dob: BasicField
  birthcountry: FieldWithCodeAndDesc
  residentialstatus: FieldWithCodeAndDesc
  passportnumber: BasicField
  passportexpirydate: BasicField
  regadd: MyInfoAddress
  housingtype: FieldWithCodeAndDesc
  hdbtype: FieldWithCodeAndDesc
  hdbownership: MyInfoHdbOwnership[]
  ownerprivate: MyInfoOwnerPrivate
  email: BasicField
  mobileno: MyInfoPhoneNumber
  marital: FieldWithCodeAndDesc
  marriagecertno: BasicField
  countryofmarriage: FieldWithCodeAndDesc
  marriagedate: BasicField
  divorcedate: BasicField
  childrenbirthrecords: MyInfoChildrenBirthRecord[]
  sponsoredchildrenrecords: MyInfoSponsoredChildrenRecord[]
  occupation: MyInfoOccupation
  employment: BasicField
  passtype: FieldWithCodeAndDesc
  passstatus: BasicField
  passexpirydate: BasicField
  employmentsector: BasicField
  householdincome: MyInfoHouseholdIncome
  vehicles: MyInfoVehicle[]
  drivinglicence: MyInfoDrivingLicence
  merdekagen: MerdekaGen
  silversupport: MyInfoSilverSupport
  gstvoucher: GSTVoucher
  'noa-basic': NOABasic
  noa: NOAFull
  'noahistory-basic': NOAHistoryBasic
  noahistory: NOAHistoryFull
  cpfcontributions: CPFContributions
  cpfemployers: CPFEmployers
  cpfbalances: CPFBalances
}

/**
 * Shape of data returned by the Person API.
 */
export type IPerson = Partial<IPersonFull>

export type HdbOwnershipScope = `${MyInfoAttribute.HDBOwnership}.${keyof MyInfoHdbOwnership}`
export type ChildrenBirthRecordsScope = `${MyInfoAttribute.ChildrenBirthRecords}.${keyof ChildCustomFields}`
export type SponsoredChildrenRecordsScope = `${MyInfoAttribute.SponsoredChildrenRecords}.${keyof SponsoredChildCustomFields}`
export type VehiclesScope = `${MyInfoAttribute.Vehicles}.${keyof MyInfoVehicleCustomFields}`
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

/**
 * Valid scopes (requested attributes) to get from MyInfo.
 */
export type MyInfoScope =
  | Exclude<
      keyof IPerson,
      | 'hdbownership'
      | 'childrenbirthrecords'
      | 'sponsoredchildrenrecords'
      | 'vehicles'
      | 'drivinglicence'
    >
  | HdbOwnershipScope
  | ChildrenBirthRecordsScope
  | SponsoredChildrenRecordsScope
  | VehiclesScope
  | DrivingLicenceScope

// Check that IPerson includes all keys from MyInfoAttribute
type IPersonCheck = Exclude<MyInfoAttribute, keyof IPerson>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type VerifyIPersonCheck<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Missing extends never = IPersonCheck
> = never
