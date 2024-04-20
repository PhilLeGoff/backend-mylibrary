import { Document } from "mongoose";

export default interface ILoanStatus extends Document {
    dateTaken: Date;
    dueDate: Date;
  }