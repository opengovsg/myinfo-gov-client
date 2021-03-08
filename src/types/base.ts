export enum MyInfoSource {
  GovtVerified = '1',
  UserProvided = '2',
  NotApplicable = '3',
  SingPassVerified = '4'
}

export enum MyInfoDataClassification {
  Confidential = 'C'
}

type SourceProp<T> = {
  source: T
}

type MyInfoSourceDefault = Exclude<MyInfoSource, MyInfoSource.NotApplicable>

// APPLICABILITY
// Certain fields may not be applicable to specific groups of people. For example, CPF
// or Residential Status is not applicable to foreigners, and Workpass is not applicable to Singapore
// citizens and PRs.

// For a full reference, see https://www.ndi-api.gov.sg/library/myinfo/implementation-myinfo-data
export type MyInfoNotApplicable = SourceProp<MyInfoSource.NotApplicable>

export type MyInfoApplicable<S> = {
  lastupdated: string
  classification: MyInfoDataClassification.Confidential
} & SourceProp<S>

type UnavailableProp<T> = {
  unavailable: T
}

export type MyInfoUnavailableField<S> = MyInfoApplicable<S> & UnavailableProp<true>

export type MyInfoAvailableMetadata<S> = MyInfoApplicable<S> & Partial<UnavailableProp<undefined>> // For convenience

export type MyInfoField<T, S = MyInfoSourceDefault> = MyInfoUnavailableField<S> |
  (T & MyInfoAvailableMetadata<S>)

type ValueType<T> = {
  value: T
}

export type StringValue = ValueType<string>
export type NumberValue = ValueType<number>
export type BooleanValue = ValueType<boolean>

export type CodeAndDesc = {
  code: string
  desc: string
}

export type MyInfoValueField = MyInfoField<StringValue>

export type MyInfoCodeField = MyInfoField<CodeAndDesc>

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
