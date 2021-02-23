import { MyInfoField, StringValue, NumberValue, BooleanValue, CodeAndDesc } from "./base"

export type BasicField = MyInfoField<StringValue>

export type FieldWithCodeAndDesc = MyInfoField<CodeAndDesc>

export enum AddressType {
  Singapore = 'SG',
  Unformatted = 'Unformatted',
}

type SGAddress = {
  type: AddressType.Singapore
  block: StringValue
  building: StringValue
  floor: StringValue
  unit: StringValue
  street: StringValue
  postal: StringValue
  country: CodeAndDesc
}

type UnformattedAddress = {
  type: AddressType.Unformatted
  line1: StringValue
  line2: StringValue
}

export type MyInfoAddress = MyInfoField<SGAddress | UnformattedAddress>

type HDBOwnershipCustomFields = {
  noofowners: NumberValue
  address: SGAddress | UnformattedAddress
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

export type HDBOwnership = MyInfoField<HDBOwnershipCustomFields>

export type OwnerPrivate = MyInfoField<BooleanValue>

type MyInfoPhoneNumberCustomFields = {
  prefix: StringValue
  areacode: StringValue
  nbr: StringValue
}

export type MyInfoPhoneNumber = MyInfoField<MyInfoPhoneNumberCustomFields>

type ChildCustomFields = {
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

export type ChildBelow21 = ChildCustomFields
export type ChildAbove21 = Pick<ChildCustomFields, 'birthcertno'>

export type ChildRecord = MyInfoField<ChildBelow21 | ChildAbove21>

type SponsoredChildCustomFields = {
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

export type SponsoredChildBelow21 = SponsoredChildCustomFields
export type SponsoredChildAbove21 = Pick<SponsoredChildCustomFields, 'nric'>

export type SponsoredChildRecord = MyInfoField<SponsoredChildBelow21 | SponsoredChildAbove21>

export type MyInfoOccupation = MyInfoField<StringValue | CodeAndDesc>

export type HouseholdIncome = MyInfoField<{
  high: NumberValue
  low: NumberValue
}>

type MyInfoVehicleCustomFields = {
  vehicleno: StringValue
  type: StringValue
  iulabelno: StringValue
  make: StringValue
  model: StringValue
  chassisno: StringValue
  engineno: StringValue
  motorno: StringValue
  yearofmanufacture: StringValue
  firstregistrationdate: StringValue
  originalregistrationdate: StringValue
  coecategory: StringValue
  coeexpirydate: StringValue
  roadtaxexpirydate: StringValue
  quotapremium: NumberValue
  openmarketvalue: NumberValue
  co2emission: NumberValue
  status: CodeAndDesc
  primarycolour: StringValue
  secondarycolour: StringValue
  attachment1: StringValue
  attachment2: StringValue
  attachment3: StringValue
  scheme: StringValue
  thcemission: NumberValue
  coemission: NumberValue
  noxemission: NumberValue
  pmemission: NumberValue
  enginecapacity: NumberValue
  powerrate: NumberValue
  effectiveownership: StringValue
  propellant: StringValue
  maximumunladenweight: NumberValue
  maximumladenweight: NumberValue
  minimumparfbenefit: NumberValue
  nooftransfers: NumberValue
  vpc: StringValue
}

export type MyInfoVehicle = MyInfoField<MyInfoVehicleCustomFields>

type StartEndDate = {
  startdate: StringValue
  enddate: StringValue
}

type PDL = {
  validity: CodeAndDesc
  expirydate: StringValue
  classes: { class: StringValue }[]
}

type QDL = {
  validity: CodeAndDesc
  expirydate: StringValue
  classes: { class: StringValue; issuedate: StringValue }[]
}

type DrivingLicenceCustomFields = {
  comstatus: CodeAndDesc
  totaldemeritpoints: NumberValue
  suspension: StartEndDate
  disqualification: StartEndDate
  revocation: StartEndDate
  pdl: PDL
  qdl: QDL
  photocardserialno: StringValue
}

export type DrivingLicence = MyInfoField<DrivingLicenceCustomFields>

export type MerdekaGen = MyInfoField<{
  eligibility: BooleanValue
  quantum: NumberValue
  message: CodeAndDesc
}>

export type SilverSupport = MyInfoField<{
  eligibility: BooleanValue
  amount: StringValue
  year: StringValue
}>

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
  hdbownership: HDBOwnership[]
  ownerprivate: OwnerPrivate
  email: BasicField
  mobileno: MyInfoPhoneNumber
  marital: FieldWithCodeAndDesc
  marriagecertno: BasicField
  countryofmarriage: FieldWithCodeAndDesc
  marriagedate: BasicField
  divorcedate: BasicField
  childrenbirthrecords: ChildRecord[]
  sponsoredchildrenrecords: SponsoredChildRecord[]
  occupation: MyInfoOccupation
  employment: BasicField
  passtype: FieldWithCodeAndDesc
  passstatus: BasicField
  passexpirydate: BasicField
  employmentsector: BasicField
  householdincome: HouseholdIncome
  vehicles: MyInfoVehicle[]
  drivinglicence: DrivingLicence
  merdekagen: MerdekaGen
  silversupport: SilverSupport
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

export type HDBOwnershipScope = `${MyInfoAttribute.HDBOwnership}.${keyof HDBOwnershipCustomFields}`
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
  | HDBOwnershipScope
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
