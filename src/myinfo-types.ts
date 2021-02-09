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

type MyInfoField<Fields> =
  | IUnavailableField
  | (Fields & IPossiblyAvailableMetadata)

interface OptionalString {
  value: string
}

interface OptionalNumber {
  value: number | ''
}

interface OptionalBoolean {
  value: boolean | ''
}

export type BasicField = MyInfoField<OptionalString>

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
  block: OptionalString
  building: OptionalString
  floor: OptionalString
  unit: OptionalString
  street: OptionalString
  postal: OptionalString
  country: CodeAndDesc
}

interface IUnformattedAddress {
  type: AddressType.Unformatted
  line1: OptionalString
  line2: OptionalString
}

export type MyInfoAddress =
  | MyInfoField<ISGAddress>
  | MyInfoField<IUnformattedAddress>

export type HDBOwnership = MyInfoField<{
  noofowners: OptionalNumber
  address: ISGAddress | IUnformattedAddress
  hdbtype: CodeAndDesc
  leasecommencementdate: OptionalString
  termoflease: OptionalNumber
  dateofpurchase: OptionalString
  dateofownershiptransfer: OptionalString
  loangranted: OptionalNumber
  originalloanrepayment: OptionalNumber
  balanceloanrepayment: {
    years: OptionalNumber
    months: OptionalNumber
  }
  outstandingloanbalance: OptionalNumber
  monthlyloaninstalment: OptionalNumber
}>

export type OwnerPrivate = MyInfoField<OptionalBoolean>

export type MyInfoPhoneNumber = MyInfoField<{
  prefix: OptionalString
  areacode: OptionalString
  nbr: OptionalString
}>

export type ChildBelow21 = MyInfoField<{
  birthcertno: OptionalString
  name: OptionalString
  hanyupinyinname: OptionalString
  aliasname: OptionalString
  hanyupinyinaliasname: OptionalString
  marriedname: OptionalString
  sex: CodeAndDesc
  race: CodeAndDesc
  secondaryrace: CodeAndDesc
  dialect: CodeAndDesc
  lifestatus: CodeAndDesc
  dob: OptionalString
  tob: OptionalString
}>

export type ChildAbove21 = MyInfoField<{
  birthcertno: OptionalString
}>

export type ChildRecord = ChildBelow21 | ChildAbove21

export type SponsoredChildBelow21 = MyInfoField<{
  nric: OptionalString
  name: OptionalString
  hanyupinyinname: OptionalString
  aliasname: OptionalString
  hanyupinyinaliasname: OptionalString
  marriedname: OptionalString
  sex: CodeAndDesc
  race: CodeAndDesc
  secondaryrace: CodeAndDesc
  dialect: CodeAndDesc
  dob: OptionalString
  birthcountry: CodeAndDesc
  lifestatus: CodeAndDesc
  residentialstatus: CodeAndDesc
  nationality: CodeAndDesc
  scprgrantdate: OptionalString
}>

export type SponsoredChildAbove21 = MyInfoField<{
  nric: OptionalString
}>

export type SponsoredChildRecord = SponsoredChildBelow21 | SponsoredChildAbove21

export type MyInfoOccupation =
  | MyInfoField<OptionalString>
  | MyInfoField<CodeAndDesc>

export type HouseholdIncome = MyInfoField<{
  high: OptionalNumber
  low: OptionalNumber
}>

export type MyInfoVehicle = MyInfoField<{
  vehicleno: OptionalString
  type: OptionalString
  iulabelno: OptionalString
  make: OptionalString
  model: OptionalString
  chassisno: OptionalString
  engineno: OptionalString
  motorno: OptionalString
  yearofmanufacture: OptionalString
  firstregistrationdate: OptionalString
  originalregistrationdate: OptionalString
  coecategory: OptionalString
  coeexpirydate: OptionalString
  roadtaxexpirydate: OptionalString
  quotapremium: OptionalNumber
  openmarketvalue: OptionalNumber
  co2emission: OptionalNumber
  status: CodeAndDesc
  primarycolour: OptionalString
  secondarycolour: OptionalString
  attachment1: OptionalString
  attachment2: OptionalString
  attachment3: OptionalString
  scheme: OptionalString
  thcemission: OptionalNumber
  coemission: OptionalNumber
  noxemission: OptionalNumber
  pmemission: OptionalNumber
  enginecapacity: OptionalNumber
  powerrate: OptionalNumber
  effectiveownership: OptionalString
  propellant: OptionalString
  maximumunladenweight: OptionalNumber
  maximumladenweight: OptionalNumber
  minimumparfbenefit: OptionalNumber
  nooftransfers: OptionalNumber
  vpc: OptionalString
}>

interface StartEndDate {
  startdate: OptionalString
  enddate: OptionalString
}

export type DrivingLicence = MyInfoField<{
  comstatus: CodeAndDesc
  totaldemeritpoints: OptionalNumber
  suspension: StartEndDate
  disqualification: StartEndDate
  revocation: StartEndDate
  pdl: {
    validity: CodeAndDesc
    expirydate: OptionalString
    classes: { class: OptionalString }[]
  }
  qdl: {
    validity: CodeAndDesc
    expirydate: OptionalString
    classes: { class: OptionalString; issuedate: OptionalString }[]
  }
  photocardserialno: OptionalString
}>

export type MerdekaGen = MyInfoField<{
  eligibility: OptionalBoolean
  quantum: OptionalNumber
  message: CodeAndDesc
}>

export type SilverSupport = MyInfoField<{
  eligibility: OptionalBoolean
  amount: OptionalString
  year: OptionalString
}>

export type GSTVoucher = MyInfoField<{
  exclusion: OptionalBoolean
  signup: OptionalBoolean
  gstmedisave: OptionalNumber
  gstregular: OptionalNumber
  gstspecial: OptionalNumber
  year: OptionalString
}>

interface INOABasicFields {
  amount: OptionalNumber
  yearofassessment: OptionalString
}

export type NOABasic = MyInfoField<INOABasicFields>

interface INOAFullFields {
  amount: OptionalNumber
  yearofassessment: OptionalString
  employment: OptionalNumber
  trade: OptionalNumber
  rent: OptionalNumber
  interest: OptionalNumber
  taxclearance: OptionalString
  category: OptionalString
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
    employer: OptionalString
    date: OptionalString
    month: OptionalString
    amount: OptionalNumber
  }[]
}>

export type CPFEmployers = MyInfoField<{
  history: {
    employer: OptionalString
    month: OptionalString
  }[]
}>

export type CPFBalances = MyInfoField<{
  ma: OptionalNumber
  oa: OptionalNumber
  sa: OptionalNumber
  ra?: OptionalNumber
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
