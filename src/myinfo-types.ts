export enum MyInfoSource {
  GovtVerified = '1',
  UserProvided = '2',
  NotApplicable = '3',
  SingPassVerified = '4',
}

interface IMetadata {
  lastupdated: string
  source: MyInfoSource
  classification: 'C'
}

interface IUnavailableField extends IMetadata {
  unavailable: true
}

interface IPossiblyAvailableMetadata extends IMetadata {
  unavailable?: false
}

type MyInfoField<CustomFields> =
  | IUnavailableField
  | (CustomFields & IPossiblyAvailableMetadata)

interface StringValue {
  value: string
}

interface NumberValue {
  value: number
}

interface BooleanValue {
  value: boolean
}

export type BasicField = MyInfoField<StringValue>

interface CodeAndDesc {
  code: string
  desc: string
}

export type FieldWithCodeAndDesc = MyInfoField<CodeAndDesc>

export enum AddressType {
  Singapore = 'SG',
  Unformatted = 'Unformatted',
}

interface ISGAddress {
  type: AddressType.Singapore
  block: StringValue
  building: StringValue
  floor: StringValue
  unit: StringValue
  street: StringValue
  postal: StringValue
  country: CodeAndDesc
}

interface IUnformattedAddress {
  type: AddressType.Unformatted
  line1: StringValue
  line2: StringValue
}

export type MyInfoAddress =
  | MyInfoField<ISGAddress>
  | MyInfoField<IUnformattedAddress>

export type HDBOwnership = MyInfoField<{
  noofowners: NumberValue
  address: ISGAddress | IUnformattedAddress
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
}>

export type OwnerPrivate = MyInfoField<BooleanValue>

export type MyInfoPhoneNumber = MyInfoField<{
  prefix: StringValue
  areacode: StringValue
  nbr: StringValue
}>

export type ChildBelow21 = MyInfoField<{
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
}>

export type ChildAbove21 = MyInfoField<{
  birthcertno: StringValue
}>

export type ChildRecord = ChildBelow21 | ChildAbove21

export type SponsoredChildBelow21 = MyInfoField<{
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
}>

export type SponsoredChildAbove21 = MyInfoField<{
  nric: StringValue
}>

export type SponsoredChildRecord = SponsoredChildBelow21 | SponsoredChildAbove21

export type MyInfoOccupation =
  | MyInfoField<StringValue>
  | MyInfoField<CodeAndDesc>

export type HouseholdIncome = MyInfoField<{
  high: NumberValue
  low: NumberValue
}>

export type MyInfoVehicle = MyInfoField<{
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
}>

interface StartEndDate {
  startdate: StringValue
  enddate: StringValue
}

export type DrivingLicence = MyInfoField<{
  comstatus: CodeAndDesc
  totaldemeritpoints: NumberValue
  suspension: StartEndDate
  disqualification: StartEndDate
  revocation: StartEndDate
  pdl: {
    validity: CodeAndDesc
    expirydate: StringValue
    classes: { class: StringValue }[]
  }
  qdl: {
    validity: CodeAndDesc
    expirydate: StringValue
    classes: { class: StringValue; issuedate: StringValue }[]
  }
  photocardserialno: StringValue
}>

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

interface INOABasicFields {
  amount: NumberValue
  yearofassessment: StringValue
}

export type NOABasic = MyInfoField<INOABasicFields>

interface INOAFullFields {
  amount: NumberValue
  yearofassessment: StringValue
  employment: NumberValue
  trade: NumberValue
  rent: NumberValue
  interest: NumberValue
  taxclearance: StringValue
  category: StringValue
}

export type NOAFull = MyInfoField<INOAFullFields>

export type NOAHistoryBasic = MyInfoField<{
  noas: INOABasicFields[]
}>

export type NOAHistoryFull = MyInfoField<{
  noas: INOAFullFields[]
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

interface IPersonFull {
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

export type IPerson = Partial<IPersonFull>

export type MyInfoAttributeString = keyof IPerson

// Check that IPerson includes all keys from MyInfoAttribute
type IPersonCheck = Exclude<MyInfoAttribute, keyof IPerson>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type VerifyIPersonCheck<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Missing extends never = IPersonCheck
> = never
