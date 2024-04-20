import mongoose, { Document, Schema, Types } from "mongoose";
import IClient from "../interfaces/documents";

const clientSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    booksLoaned: [
      { type: mongoose.Schema.Types.ObjectId, ref: "books", required: true },
    ],
  },
  { collection: "clients" }
);

const Client = mongoose.model<IClient>("clients", clientSchema);

export { Client };
