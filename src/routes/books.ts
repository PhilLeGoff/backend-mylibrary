import { Author } from "../models/authors";
import { Request, Response } from "express";

var express = require("express");
var router = express.Router();
import { Book } from "../models/books";

require("../models/connection");

interface ICreateBookRequest extends Request {
  body: {
    title: string;
    authors: string[];
    genres: string[];
    isbn: string;
    picture: string;
  };
}

router.get("/test", (req: Request, res: Response) => {
  res.status(200).json({message: "booksWorking"})
})

router.post("/", async (req: ICreateBookRequest, res: Response) => {
  const { title, authors, genres, isbn, picture } = req.body;
  console.log("genres", genres);

  try {
    const authorIds = [];
    for (const authorName of authors) {
      let author = await Author.findOne({ name: authorName });
      if (!author) {
        // Create a new author document if not found
        author = await Author.create({ name: authorName, books: [] });
      }
      authorIds.push(author._id);
    }

    const bookNumber = await Book.find({ isbn }).then(
      (books) => books.length + 1
    );
    console.log("book", bookNumber);

    const newBook = await Book.create({
      title,
      authors: authors,
      genres: genres,
      isbn,
      picture,
      bookNumber: bookNumber,
      loan: null,
    });

    for (const authorId of authorIds) {
      const author = await Author.findById(authorId).populate("books");
      if (author) {
        const hasBook = author.books.some((book) => {
          if (book instanceof Book) {
            return book.isbn === isbn;
          }
          return false;
        });
        if (!hasBook) {
          author.books.push(newBook._id);
          await author.save();
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: `Added book with ISBN ${isbn} and authors ${authors.join(", ")}`,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.get("/:option/:input", async (req: Request, res: Response) => {
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
    

    const books = await Book.find(query);

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
  } catch (error) {
    console.error("Error finding books:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.delete("/", async (req: Request, res: Response) => {
  const id = req.body.bookId;

  try {
    const deletedBook = await Book.findById(id);
    if (!deletedBook) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    await Book.findByIdAndDelete(id);

    for (const authorName of deletedBook.authors) {
      const author = await Author.findOne({ name: authorName });
      if (author) {
        author.books = author.books.filter((book) => book.toString() !== id);
        if (author.books.length === 0) {
          await Author.findByIdAndDelete(author._id);
        } else {
          await author.save();
        }
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
