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
const authors_1 = require("../models/authors");
var express = require("express");
var router = express.Router();
const books_1 = require("../models/books");
require("../models/connection");
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, authors, genres, isbn, picture } = req.body;
    console.log("genres", genres);
    try {
        const authorIds = [];
        for (const authorName of authors) {
            let author = yield authors_1.Author.findOne({ name: authorName });
            if (!author) {
                // Create a new author document if not found
                author = yield authors_1.Author.create({ name: authorName, books: [] });
            }
            authorIds.push(author._id);
        }
        const bookNumber = yield books_1.Book.find({ isbn }).then((books) => books.length + 1);
        console.log("book", bookNumber);
        const newBook = yield books_1.Book.create({
            title,
            authors: authors,
            genres: genres,
            isbn,
            picture,
            bookNumber: bookNumber,
            loan: null,
        });
        for (const authorId of authorIds) {
            const author = yield authors_1.Author.findById(authorId).populate("books");
            if (author) {
                const hasBook = author.books.some((book) => {
                    if (book instanceof books_1.Book) {
                        return book.isbn === isbn;
                    }
                    return false;
                });
                if (!hasBook) {
                    author.books.push(newBook._id);
                    yield author.save();
                }
            }
        }
        return res.status(201).json({
            success: true,
            message: `Added book with ISBN ${isbn} and authors ${authors.join(", ")}`,
        });
    }
    catch (error) {
        console.error("Error creating book:", error);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
}));
router.get("/:option/:input", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { option, input } = req.params;
    console.log(option, input, "tagranmere");
    try {
        let query = {};
        switch (option) {
            case "title":
                query = { title: { $regex: input, $options: "i" } };
                break;
            case "authors":
                query = { authors: { $regex: input, $options: "i" } };
                break;
            case "genres":
                query = { genres: { $regex: input, $options: "i" } };
                break;
            case "isbn":
                query = { isbn: input };
                break;
            case "due":
                query = { loan: { $ne: null } };
                break;
            default:
                return res
                    .status(400)
                    .json({ success: false, error: "Invalid option" });
        }
        const books = yield books_1.Book.find(query);
        if (!books || books.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "No books found" });
        const booksData = books.map((book) => ({
            bookId: book._id,
            title: book.title,
            authors: book.authors,
            genres: book.genres,
            isbn: book.isbn,
            picture: book.picture,
            bookNumber: book.bookNumber,
            available: book.loan === null ? true : false,
        }));
        console.log("booksData", booksData);
        return res.status(200).json({ success: true, books: booksData });
    }
    catch (error) {
        console.error("Error finding books:", error);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
}));
router.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.bookId;
    try {
        const deletedBook = yield books_1.Book.findById(id);
        if (!deletedBook) {
            return res.status(404).json({ success: false, error: "Book not found" });
        }
        yield books_1.Book.findByIdAndDelete(id);
        for (const authorName of deletedBook.authors) {
            const author = yield authors_1.Author.findOne({ name: authorName });
            if (author) {
                author.books = author.books.filter((book) => book.toString() !== id);
                if (author.books.length === 0) {
                    yield authors_1.Author.findByIdAndDelete(author._id);
                }
                else {
                    yield author.save();
                }
            }
        }
        return res
            .status(200)
            .json({ success: true, message: "Book deleted successfully" });
    }
    catch (error) {
        console.log("Error deleting book:", error);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
}));
module.exports = router;
//# sourceMappingURL=books.js.map