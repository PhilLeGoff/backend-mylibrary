import mongoose, { Document, Schema, Types } from "mongoose";
import IBook from "../interfaces/documents";

const loanStatusSchema: Schema = new Schema({
  dateTaken: { type: Date, required: true },
  dueDate: { type: Date, required: true },
});

const loanSchema: Schema = new Schema({
  status: { type: loanStatusSchema, required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clients",
    required: true,
  },
});

const bookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    genres: { type: [String], required: false },
    isbn: { type: String, required: true },
    picture: { type: String, required: false },
    bookNumber: Number,
    loan: {type: loanSchema, required: false, default: null}
  },
  { collection: "books" }
);

const Book = mongoose.model<IBook>("books", bookSchema);

export { Book };
