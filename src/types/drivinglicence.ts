import { MyInfoField, StringValue, NumberValue, CodeAndDesc } from "./base";

export type StartEndDate = {
  startdate: StringValue;
  enddate: StringValue;
};
export type PDL = {
  validity: CodeAndDesc;
  expirydate: StringValue;
  classes: { class: StringValue; }[];
};
export type QDL = {
  validity: CodeAndDesc;
  expirydate: StringValue;
  classes: { class: StringValue; issuedate: StringValue; }[];
};
export type DrivingLicenceCustomFields = {
  comstatus: CodeAndDesc;
  totaldemeritpoints: NumberValue;
  suspension: StartEndDate;
  disqualification: StartEndDate;
  revocation: StartEndDate;
  pdl: PDL;
  qdl: QDL;
  photocardserialno: StringValue;
};

export type MyInfoDrivingLicence = MyInfoField<DrivingLicenceCustomFields>;
