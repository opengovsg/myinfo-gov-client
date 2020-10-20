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

interface IMyInfoBasicField extends IMyInfoMetadata {
    value: string
}

interface IMyInfoHighLowField extends IMyInfoMetadata {
    high: number
    low: number
}

interface IMyInfoFieldWithDesc extends IMyInfoBasicField {
    desc: string
}

interface IMyInfoSexField extends IMyInfoMetadata {
    value: MyInfoSex
}

interface IChildrenBirthRecord {
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
