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
  unavailable?: boolean
}

interface OptionalString {
  value?: string
}

interface OptionalNumber {
  value?: number | ''
}

interface OptionalBoolean {
  value?: boolean | ''
}

export interface IBasicField extends IMetadata, OptionalString {}

interface CodeAndDesc {
  code?: string
  desc?: string
}

export interface IFieldWithCodeAndDesc extends IMetadata, CodeAndDesc {}

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
  | (ISGAddress & IMetadata)
  | (IUnformattedAddress & IMetadata)

export interface IHDBOwnership extends IMetadata {
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
}

export interface IOwnerPrivate extends IMetadata, OptionalBoolean {}

export interface IMyInfoPhoneNumber extends IMetadata {
  prefix: OptionalString
  areacode: OptionalString
  nbr: OptionalString
}

export interface IChildBelow21 extends IMetadata {
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
}

export interface IChildAbove21 extends IMetadata {
  birthcertno: OptionalString
}

export type ChildRecord = IChildBelow21 | IChildAbove21

export interface ISponsoredChildBelow21 extends IMetadata {
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
}

export interface ISponsoredChildAbove21 extends IMetadata {
  nric: OptionalString
}

export type SponsoredChildRecord =
  | ISponsoredChildBelow21
  | ISponsoredChildAbove21

export type MyInfoOccupation = IMetadata & OptionalString & CodeAndDesc

export interface HouseholdIncome extends IMetadata {
  high: OptionalNumber
  low: OptionalNumber
}

export interface IMyInfoVehicle extends IMetadata {
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
}

interface StartEndDate {
  startdate: OptionalString
  enddate: OptionalString
}
export interface IDrivingLicence extends IMetadata {
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
}

export interface IMerdekaGen extends IMetadata {
  eligibility: OptionalBoolean
  quantum: OptionalNumber
  message: CodeAndDesc
}

export interface ISilverSupport extends IMetadata {
  eligibility: OptionalBoolean
  amount: OptionalString
  year: OptionalString
}

export interface IGSTVoucher extends IMetadata {
  exclusion: OptionalBoolean
  signup: OptionalBoolean
  gstmedisave: OptionalNumber
  gstregular: OptionalNumber
  gstspecial: OptionalNumber
  year: OptionalString
}

interface INOABasicFields {
  amount: OptionalNumber
  yearofassessment: OptionalString
}

export interface INOABasic extends IMetadata, INOABasicFields {}

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

export interface INOAFull extends IMetadata, INOAFullFields {}

export interface INOAHistoryBasic extends IMetadata {
  noas: INOABasicFields[]
}

export interface INOAHistoryFull extends IMetadata {
  noas: INOAFullFields[]
}

export interface ICPFContributions extends IMetadata {
  history: {
    employer: OptionalString
    date: OptionalString
    month: OptionalString
    amount: OptionalNumber
  }[]
}

export interface ICPFEmployers extends IMetadata {
  history: {
    employer: OptionalString
    month: OptionalString
  }[]
}

export interface ICPFBalances extends IMetadata {
  ma: OptionalNumber
  oa: OptionalNumber
  sa: OptionalNumber
  ra?: OptionalNumber
}

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
  uinfin: IBasicField
  name: IBasicField
  hanyupinyinname: IBasicField
  aliasname: IBasicField
  hanyupinyinaliasname: IBasicField
  marriedname: IBasicField
  sex: IFieldWithCodeAndDesc
  race: IFieldWithCodeAndDesc
  secondaryrace: IFieldWithCodeAndDesc
  dialect: IFieldWithCodeAndDesc
  nationality: IFieldWithCodeAndDesc
  dob: IBasicField
  birthcountry: IFieldWithCodeAndDesc
  residentialstatus: IFieldWithCodeAndDesc
  passportnumber: IBasicField
  passportexpirydate: IBasicField
  regadd: MyInfoAddress
  housingtype: IFieldWithCodeAndDesc
  hdbtype: IFieldWithCodeAndDesc
  hdbownership: IHDBOwnership[]
  ownerprivate: IOwnerPrivate
  email: IBasicField
  mobileno: IMyInfoPhoneNumber
  marital: IFieldWithCodeAndDesc
  marriagecertno: IBasicField
  countryofmarriage: IFieldWithCodeAndDesc
  marriagedate: IBasicField
  divorcedate: IBasicField
  childrenbirthrecords: ChildRecord[]
  sponsoredchildrenrecords: SponsoredChildRecord[]
  occupation: MyInfoOccupation
  employment: IBasicField
  passtype: IFieldWithCodeAndDesc
  passstatus: IBasicField
  passexpirydate: IBasicField
  employmentsector: IBasicField
  householdincome: HouseholdIncome
  vehicles: IMyInfoVehicle[]
  drivinglicence: IDrivingLicence
  merdekagen: IMerdekaGen
  silversupport: ISilverSupport
  gstvoucher: IGSTVoucher
  'noa-basic': INOABasic
  noa: INOAFull
  'noahistory-basic': INOAHistoryBasic
  noahistory: INOAHistoryFull
  cpfcontributions: ICPFContributions
  cpfemployers: ICPFEmployers
  cpfbalances: ICPFBalances
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
