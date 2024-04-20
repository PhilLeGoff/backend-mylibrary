import express, { Request, Response } from "express";
require("dotenv").config();

var path = require("path");
var cookieParser = require("cookie-parser");
import morgan from "morgan";

const baseRouter = require("./routes/base");
const booksRouter = require("./routes/books");
const clientsRouter = require("./routes/clients");
const loansRouter = require("./routes/loans");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));

app.use("/books", booksRouter);
app.use("/clients", clientsRouter);
app.use("/loans", loansRouter);
app.use("/", baseRouter);

// app.get('/', (_req: Request, res: Response) => {
// 	return res.send('Express Typescript on Vercel')
// })

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

export default app;
