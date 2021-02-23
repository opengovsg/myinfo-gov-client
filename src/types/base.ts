export enum MyInfoSource {
  GovtVerified = '1',
  UserProvided = '2',
  NotApplicable = '3',
  SingPassVerified = '4'
}

type Metadata = {
  lastupdated: string
  source: MyInfoSource
  classification: 'C'
}

type UnavailableField = Metadata & {
  unavailable: true
}

type PossiblyAvailableMetadata = Metadata & {
  unavailable?: false
}

export type MyInfoField<T> = UnavailableField |
  (T & PossiblyAvailableMetadata)

export type StringValue = {
  value: string
}

export type NumberValue = {
  value: number
}

export type BooleanValue = {
  value: boolean
}

export type CodeAndDesc = {
  code: string
  desc: string
}


export type BasicField = MyInfoField<StringValue>

export type FieldWithCodeAndDesc = MyInfoField<CodeAndDesc>

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