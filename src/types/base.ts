export enum MyInfoSource {
  GovtVerified = '1',
  UserProvided = '2',
  NotApplicable = '3',
  SingPassVerified = '4'
}

type Metadata = {
  lastupdated: string;
  source: MyInfoSource;
  classification: 'C';
}

type UnavailableField = Metadata & {
  unavailable: true;
}

type PossiblyAvailableMetadata = Metadata & {
  unavailable?: false;
}

export type MyInfoField<T> = UnavailableField |
  (T & PossiblyAvailableMetadata)

export type StringValue = {
  value: string;
}

export type NumberValue = {
  value: number;
}

export type BooleanValue = {
  value: boolean;
}

export type CodeAndDesc = {
  code: string
  desc: string
}