var express = require("express");
var router = express.Router();
import { Request, Response } from "express";

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "welcome to myLibrary api" });
});

module.exports = router;
