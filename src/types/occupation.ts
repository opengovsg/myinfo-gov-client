import { MyInfoField, StringValue, CodeAndDesc, MyInfoSource } from "./base"

export type MyInfoOccupation =
    | MyInfoField<StringValue, MyInfoSource.UserProvided>
    | MyInfoField<CodeAndDesc, MyInfoSource.GovtVerified>
