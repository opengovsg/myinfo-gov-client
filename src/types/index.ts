import { MyInfoAddress } from "./address"
import { MyInfoAttribute } from "./base"
import { MyInfoChildrenBirthRecords, ChildrenBirthRecordsScope } from "./childrenbirthrecords"
import { MyInfoHdbOwnership, HdbOwnershipScope } from "./hdbownership"
import { MyInfoHouseholdIncome } from "./householdincome"
import { MyInfoPhoneNumber } from "./mobileno"
import { MyInfoVehicle, VehiclesScope } from "./vehicles"
import { MyInfoOccupation } from "./occupation"
import { MyInfoOwnerPrivate } from "./ownerprivate"
import { MyInfoSponsoredChildrenRecords, SponsoredChildrenRecordsScope } from "./sponsoredchildrenrecords"
import { MyInfoDrivingLicence, DrivingLicenceScope } from "./drivinglicence"
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
import { MyInfoUinFin } from "./uinfin"
import { MyInfoName } from "./name"
import { MyInfoHanyuPinyinName } from "./hanyupinyinname"
import { MyInfoAliasName } from "./aliasname"
import { MyInfoHanyuPinyinAliasName } from "./hanyupinyinaliasname"
import { MyInfoMarriedName } from "./marriedname"
import { MyInfoSex } from "./sex"
import { MyInfoRace } from "./race"
import { MyInfoSecondaryRace } from "./secondaryrace"
import { MyInfoDialect } from "./dialect"
import { MyInfoNationality } from "./nationality"
import { MyInfoDob } from "./dob"
import { MyInfoBirthCountry } from "./birthcountry"
import { MyInfoResidentialStatus } from "./residentialstatus"
import { MyInfoPassportNumber } from "./passportnumber"
import { MyInfoPassportExpiryDate } from "./passportexpirydate"
import { MyInfoHousingType } from "./housingtype"
import { MyInfoHdbType } from "./hdbtype"
import { MyInfoEmail } from "./email"
import { MyInfoMarital } from "./marital"
import { MyInfoMarriageCertNo } from "./marriagecertno"
import { MyInfoCountryOfMarriage } from "./countryofmarriage"
import { MyInfoMarriageDate } from "./marriagedate"
import { MyInfoDivorceDate } from "./divorcedate"
import { MyInfoEmployment } from "./employment"
import { MyInfoPassType } from "./passtype"
import { MyInfoPassStatus } from "./passstatus"
import { MyInfoPassExpiryDate } from "./passexpirydate"
import { MyInfoEmploymentSector } from "./employmentsector"

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
  childrenbirthrecords: MyInfoChildrenBirthRecords
  sponsoredchildrenrecords: MyInfoSponsoredChildrenRecords
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

/**
 * Valid scopes (requested attributes) to get from MyInfo.
 */
export type MyInfoScope =
  | Exclude<
      keyof IPerson,
      | MyInfoAttribute.HDBOwnership
      | MyInfoAttribute.ChildrenBirthRecords
      | MyInfoAttribute.SponsoredChildrenRecords
      | MyInfoAttribute.Vehicles
      | MyInfoAttribute.DrivingLicence
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

export * from './address'
export * from './aliasname'
export * from './base'
export * from './birthcountry'
export * from './childrenbirthrecords'
export * from './countryofmarriage'
export * from './cpfbalances'
export * from './cpfcontributions'
export * from './cpfemployers'
export * from './dialect'
export * from './divorcedate'
export * from './dob'
export * from './drivinglicence'
export * from './email'
export * from './employment'
export * from './employmentsector'
export * from './gstvoucher'
export * from './hanyupinyinaliasname'
export * from './hanyupinyinname'
export * from './hdbownership'
export * from './hdbtype'
export * from './householdincome'
export * from './housingtype'
export * from './marital'
export * from './marriagecertno'
export * from './marriagedate'
export * from './marriedname'
export * from './merdekagen'
export * from './mobileno'
export * from './name'
export * from './nationality'
export * from './noa-basic'
export * from './noa'
export * from './noahistory-basic'
export * from './noahistory'
export * from './occupation'
export * from './ownerprivate'
export * from './passexpirydate'
export * from './passportexpirydate'
export * from './passportnumber'
export * from './passstatus'
export * from './passtype'
export * from './race'
export * from './residentialstatus'
export * from './secondaryrace'
export * from './sex'
export * from './silversupport'
export * from './sponsoredchildrenrecords'
export * from './uinfin'
export * from './vehicles'
