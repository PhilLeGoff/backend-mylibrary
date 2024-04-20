import { Request, Response } from "express";

var express = require("express");
var router = express.Router();
import { Book } from "../models/books";
import { Client } from "../models/clients";

require("../models/connection");

router.put("/", async (req: Request, res: Response) => {
  const { bookTitle, clientName, bookNumber } = req.body;

  try {

    const bookFound = await Book.findOne({
      title: bookTitle,
      bookNumber: bookNumber,
    });
    if (!bookFound) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found." });
    }

    const clientFound = await Client.findOneAndUpdate(
      { fullName: clientName },
      { $push: { booksLoaned: bookFound._id } }
    );

    if (!clientFound) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found." });
    }

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 14); // Due date is 2 weeks after today

    const status = {
      dateTaken: today,
      dueDate: dueDate,
    };

    await Book.updateOne(
      { _id: bookFound._id },
      { $set: { loan: { status: status, client: clientFound._id } } }
    );

    return res
      .status(200)
      .json({ success: true, message: "Book loaned successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.put("/delete", async (req: Request, res: Response) => {
  const bookId = req.body.bookId

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId },
      { $set: { loan: null } },
      { new: true }
    );

    if (!updatedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found." });
    } else {

    }

    await Client.updateOne(
        { booksLoaned: bookId },
        { $pull: { booksLoaned: bookId } }
      );

    return res
      .status(200)
      .json({
        success: true,
        message: "Loan removed successfully.",
        book: updatedBook,
      });
  } catch (error) {
    console.error("Error removing loan:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
