import { MyInfoAddress } from "./address"
import { BasicField, FieldWithCodeAndDesc, MyInfoAttribute } from "./base"
import { MyInfoChildrenBirthRecord, ChildCustomFields } from "./childrenbirthrecords"
import { MyInfoHdbOwnership } from "./hdbownership"
import { MyInfoHouseholdIncome } from "./householdincome"
import { MyInfoPhoneNumber } from "./mobileno"
import { MyInfoVehicle, MyInfoVehicleCustomFields } from "./vehicles"
import { MyInfoOccupation } from "./occupation"
import { MyInfoOwnerPrivate } from "./ownerprivate"
import { MyInfoSponsoredChildrenRecord, SponsoredChildCustomFields } from "./sponsoredchildrenrecords"
import { MyInfoDrivingLicence, DrivingLicenceCustomFields, StartEndDate, PDL, QDL } from "./drivinglicence"
import { MyInfoMerdekaGen } from "./merdekagen"
import { MyInfoSilverSupport } from "./silversupport"
import { MyInfoGstVoucher } from "./gstvoucher"
import { MyInfoNoaBasic } from "./noa-basic"
import { MyInfoNoa } from "./noa"
import { MyInfoNoaHistoryBasic } from "./noahistory-basic"
import { MyInfoNoaHistory } from "./noahistory"
import { MyInfoCpfContributions } from "./cpfcontributions"
import { MyInfoCpfEmployers } from "./cpfemployers"
import { MyInfoCpfBalances } from "./cpfbalances"

type MyInfoUinFin = BasicField
type MyInfoName = BasicField
type MyInfoHanyuPinyinName = BasicField
type MyInfoAliasName = BasicField
type MyInfoHanyuPinyinAliasName = BasicField
type MyInfoMarriedName = BasicField
type MyInfoSex = FieldWithCodeAndDesc
type MyInfoRace = FieldWithCodeAndDesc
type MyInfoSecondaryRace = FieldWithCodeAndDesc
type MyInfoDialect = FieldWithCodeAndDesc
type MyInfoNationality = FieldWithCodeAndDesc
type MyInfoDob = BasicField
type MyInfoBirthCountry = FieldWithCodeAndDesc
type MyInfoResidentialStatus = FieldWithCodeAndDesc
type MyInfoPassportNumber = BasicField
type MyInfoPassportExpiryDate = BasicField
type MyInfoHousingType = FieldWithCodeAndDesc
type MyInfoHdbType = FieldWithCodeAndDesc
type MyInfoEmail = BasicField
type MyInfoMarital = FieldWithCodeAndDesc
type MyInfoMarriageCertNo = BasicField
type MyInfoCountryOfMarriage = FieldWithCodeAndDesc
type MyInfoMarriageDate = BasicField
type MyInfoDivorceDate = BasicField
type MyInfoEmployment = BasicField
type MyInfoPassType = FieldWithCodeAndDesc
type MyInfoPassStatus = BasicField
type MyInfoPassExpiryDate = BasicField
type MyInfoEmploymentSector = BasicField

type IPersonFull = {
  uinfin: MyInfoUinFin
  name: MyInfoName
  hanyupinyinname: MyInfoHanyuPinyinName
  aliasname: MyInfoAliasName
  hanyupinyinaliasname: MyInfoHanyuPinyinAliasName
  marriedname: MyInfoMarriedName
  sex: MyInfoSex
  race: MyInfoRace
  secondaryrace: MyInfoSecondaryRace
  dialect: MyInfoDialect
  nationality: MyInfoNationality
  dob: MyInfoDob
  birthcountry: MyInfoBirthCountry
  residentialstatus: MyInfoResidentialStatus
  passportnumber: MyInfoPassportNumber
  passportexpirydate: MyInfoPassportExpiryDate
  regadd: MyInfoAddress
  housingtype: MyInfoHousingType
  hdbtype: MyInfoHdbType
  hdbownership: MyInfoHdbOwnership[]
  ownerprivate: MyInfoOwnerPrivate
  email: MyInfoEmail
  mobileno: MyInfoPhoneNumber
  marital: MyInfoMarital
  marriagecertno: MyInfoMarriageCertNo
  countryofmarriage: MyInfoCountryOfMarriage
  marriagedate: MyInfoMarriageDate
  divorcedate: MyInfoDivorceDate
  childrenbirthrecords: MyInfoChildrenBirthRecord[]
  sponsoredchildrenrecords: MyInfoSponsoredChildrenRecord[]
  occupation: MyInfoOccupation
  employment: MyInfoEmployment
  passtype: MyInfoPassType
  passstatus: MyInfoPassStatus
  passexpirydate: MyInfoPassExpiryDate
  employmentsector: MyInfoEmploymentSector
  householdincome: MyInfoHouseholdIncome
  vehicles: MyInfoVehicle[]
  drivinglicence: MyInfoDrivingLicence
  merdekagen: MyInfoMerdekaGen
  silversupport: MyInfoSilverSupport
  gstvoucher: MyInfoGstVoucher
  'noa-basic': MyInfoNoaBasic
  noa: MyInfoNoa
  'noahistory-basic': MyInfoNoaHistoryBasic
  noahistory: MyInfoNoaHistory
  cpfcontributions: MyInfoCpfContributions
  cpfemployers: MyInfoCpfEmployers
  cpfbalances: MyInfoCpfBalances
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
