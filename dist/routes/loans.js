"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
const books_1 = require("../models/books");
const clients_1 = require("../models/clients");
require("../models/connection");
router.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookTitle, clientName, bookNumber } = req.body;
    try {
        console.log(bookTitle, clientName, bookNumber, "fuck");
        const bookFound = yield books_1.Book.findOne({
            title: bookTitle,
            bookNumber: bookNumber,
        });
        if (!bookFound) {
            console.log("why");
            return res
                .status(404)
                .json({ success: false, message: "Book not found." });
        }
        const clientFound = yield clients_1.Client.findOneAndUpdate({ fullName: clientName }, { $push: { booksLoaned: bookFound._id } });
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
        yield books_1.Book.updateOne({ _id: bookFound._id }, { $set: { loan: { status: status, client: clientFound._id } } });
        return res
            .status(200)
            .json({ success: true, message: "Book loaned successfully." });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}));
router.put("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.body.bookId;
    console.log('bookId', bookId);
    try {
        const updatedBook = yield books_1.Book.findOneAndUpdate({ _id: bookId }, { $set: { loan: null } }, { new: true });
        console.log("updatedbook", updatedBook);
        if (!updatedBook) {
            return res
                .status(404)
                .json({ success: false, message: "Book not found." });
        }
        else {
        }
        const updatedClient = yield clients_1.Client.updateOne({ booksLoaned: bookId }, { $pull: { booksLoaned: bookId } });
        return res
            .status(200)
            .json({
            success: true,
            message: "Loan removed successfully.",
            book: updatedBook,
        });
    }
    catch (error) {
        console.error("Error removing loan:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error." });
    }
}));
module.exports = router;
//# sourceMappingURL=loans.js.map