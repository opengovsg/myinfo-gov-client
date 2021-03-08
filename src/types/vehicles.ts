import {
  MyInfoField,
  StringValue,
  NumberValue,
  CodeAndDesc,
  MyInfoAttribute,
} from './base'

export type MyInfoVehicleFull = {
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

export type MyInfoVehicle = MyInfoField<MyInfoVehicleFull>
export type VehiclesScope = `${MyInfoAttribute.Vehicles}.${keyof MyInfoVehicleFull}`
