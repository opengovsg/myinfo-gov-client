export enum MyInfoSource {
    GovtVerified = '1',
    UserProvided = '2',
    NotApplicable = '3',
    SingPassVerified = '4',
}

export enum MyInfoSex {
    Male = 'M',
    Female = 'F',
    Unknown = 'U',
}

interface IMyInfoMetadata {
    lastUpdated: string
    source: MyInfoSource
    classification: 'C'
}

export interface IMyInfoBasicField extends IMyInfoMetadata {
    value?: string
}

export interface IMyInfoHighLowField extends IMyInfoMetadata {
    high: number
    low: number
}

export interface IMyInfoFieldWithDesc extends IMyInfoBasicField {
    desc: string
}

export interface IMyInfoSexField extends IMyInfoMetadata {
    value: MyInfoSex
}

export interface IChildrenBirthRecord {
    birthcertno: IMyInfoBasicField
    name: IMyInfoBasicField
    hanyupinyinname: IMyInfoBasicField
    aliasname: IMyInfoBasicField
    hanyupinyinaliasname: IMyInfoBasicField
    marriedname: IMyInfoBasicField
    sex: IMyInfoSexField
    race: IMyInfoBasicField
    secondaryrace: IMyInfoBasicField
    dob: IMyInfoBasicField
    tob: IMyInfoBasicField
    dialect: IMyInfoBasicField
    lifestatus: IMyInfoBasicField
}

export interface IMyInfoPhoneNo extends IMyInfoMetadata {
    code: string
    prefix: string
    nbr: string
}

export interface IMyInfoAddr extends IMyInfoMetadata {
    country: string
    unit: string
    street: string
    block: string
    postal: string
    floor: string
    building: string
}

export enum MyInfoAttribute {
    Name = 'name',
    MarriedName = 'marriedname',
    HanYuPinYinName = 'hanyupinyinname',
    AliasName = 'aliasname',
    HanYuPinYinAliasName = 'hanyupinyinaliasname',
    Sex = 'sex',
    Race = 'race',
    Dialect = 'dialect',
    Nationality = 'nationality',
    DOB = 'dob',
    BirthCountry = 'birthcountry',
    SecondaryRace = 'secondaryrace',
    ResidentialStatus = 'residentialstatus',
    PassportNumber = 'passportnumber',
    PassportExpiryDate = 'passportexpirydate',
    Email = 'email',
    MobileNo = 'mobileno',
    HomeNo = 'homeno',
    RegisteredAddress = 'regadd',
    HousingType = 'housingtype',
    HDBType = 'hdbtype',
    MailAddress = 'mailadd',
    BillingAddress = 'billadd',
    MaritalStatus = 'marital',
    EducationLevel = 'edulevel',
    MarriageCertNumber = 'marriagecertno',
    CountryOfMarriage = 'countryofmarriage',
    MarriageDate = 'marriagedate',
    DivorceDate = 'divorcedate',
    ChildrenBirthRecords = 'childrenbirthrecords',
    Relationships = 'relationships',
    GradYear = 'gradyear',
    SchoolName = 'schoolname',
    Occupation = 'occupation',
    Employment = 'employment',
    WorkPassStatus = 'workpassstatus',
    WorkPassExpiryDate = 'workpassexpirydate',
    HouseholdIncome = 'householdincome',
    VehicleNumber = 'vehno',
}

export interface IPersonBasic {
    name: IMyInfoBasicField
    hanyupinyinname: IMyInfoBasicField
    aliasname: IMyInfoBasicField
    hanyupinyinaliasname: IMyInfoBasicField
    marriedname: IMyInfoBasicField
    sex: IMyInfoSexField
    race: IMyInfoBasicField
    secondaryrace: IMyInfoBasicField
    dialect: IMyInfoBasicField
    nationality: IMyInfoBasicField
    dob: IMyInfoBasicField
    birthcountry: IMyInfoBasicField
    residentialstatus: IMyInfoBasicField
    passportnumber: IMyInfoBasicField
    passportexpirydate: IMyInfoBasicField
    regadd: IMyInfoAddr
    mailadd: IMyInfoAddr
    billadd: IMyInfoAddr
    housingtype: IMyInfoBasicField
    hdbtype: IMyInfoBasicField
    email: IMyInfoBasicField
    homeno: IMyInfoPhoneNo
    mobileno: IMyInfoPhoneNo
    marital: IMyInfoBasicField
    marriagecertno: IMyInfoBasicField
    countryofmarriage: IMyInfoBasicField
    marriagedate: IMyInfoBasicField
    divorcedate: IMyInfoBasicField
    childrenbirthrecords: IChildrenBirthRecord[]
    relationships: Record<string, unknown>[] // deprecated
    edulevel: IMyInfoBasicField
    gradyear: IMyInfoBasicField
    schoolname: IMyInfoFieldWithDesc
    occupation: IMyInfoFieldWithDesc
    employment: IMyInfoBasicField
    workpassstatus: IMyInfoBasicField
    workpassexpirydate: IMyInfoBasicField
    householdincome: IMyInfoHighLowField
    vehno: IMyInfoBasicField
    uinFin: string
}

// Check that IPersonBasic includes all keys from MyInfoAttribute
type IPersonBasicCheck = Exclude<MyInfoAttribute, keyof IPersonBasic>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type VerifyIPersonBasicCheck<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Missing extends never = IPersonBasicCheck,
> = never
