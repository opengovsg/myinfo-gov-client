import { MyInfoField, StringValue, CodeAndDesc } from "./base";

export type SponsoredChildCustomFields = {
  nric: StringValue;
  name: StringValue;
  hanyupinyinname: StringValue;
  aliasname: StringValue;
  hanyupinyinaliasname: StringValue;
  marriedname: StringValue;
  sex: CodeAndDesc;
  race: CodeAndDesc;
  secondaryrace: CodeAndDesc;
  dialect: CodeAndDesc;
  dob: StringValue;
  birthcountry: CodeAndDesc;
  lifestatus: CodeAndDesc;
  residentialstatus: CodeAndDesc;
  nationality: CodeAndDesc;
  scprgrantdate: StringValue;
};

export type SponsoredChildBelow21 = SponsoredChildCustomFields;
export type SponsoredChildAbove21 = Pick<SponsoredChildCustomFields, 'nric'>;

export type MyInfoSponsoredChildrenRecord = MyInfoField<SponsoredChildBelow21 | SponsoredChildAbove21>;
