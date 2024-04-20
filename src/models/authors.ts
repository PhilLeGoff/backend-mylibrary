import mongoose, { Document, Schema, Types } from "mongoose";

import IAuthor from "../interfaces/documents"

const authorSchema: Schema = new Schema({
  name: { type: String, required: true },
  books: [
    { type: mongoose.Schema.Types.ObjectId, ref: "books", required: true },
  ],
});

const Author = mongoose.model<IAuthor>("authors", authorSchema);

export { Author };
