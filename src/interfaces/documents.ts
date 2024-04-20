import { Document, Types } from "mongoose";
import ILoan from "./ILoan";

export default interface IBook extends Document {
  title: string;
  authors: string[];
  genres: string[];
  isbn: string;
  picture: string;
  bookNumber: number;
  loan: ILoan;
}

export default interface IClient extends Document {
  fullName: string;
  phoneNumber: string;
  booksLoaned: Types.ObjectId[];
}

export default interface IAuthor extends Document {
  name: string;
  books: Types.ObjectId[];
}
