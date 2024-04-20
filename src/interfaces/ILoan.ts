import { Document, Types } from "mongoose";
import ILoanStatus from "./ILoanStatus";

export default interface ILoan extends Document {
  status: ILoanStatus;
  client: Types.ObjectId;
}