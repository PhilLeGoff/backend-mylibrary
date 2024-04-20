"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
const morgan_1 = __importDefault(require("morgan"));
const baseRouter = require("./routes/base");
const booksRouter = require('./routes/books');
const clientsRouter = require('./routes/clients');
const loansRouter = require('./routes/loans');
const cors = require("cors");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express_1.default.json());
app.use(cookieParser());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path.join(__dirname, "public")));
app.use((0, morgan_1.default)('dev'));
app.use('/books', booksRouter);
app.use('/clients', clientsRouter);
app.use('/loans', loansRouter);
app.use('/', baseRouter);
app.get('/', (_req, res) => {
    return res.send('Express Typescript on Vercel');
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map