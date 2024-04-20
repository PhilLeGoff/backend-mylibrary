"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.get("/", (req, res) => {
    res.status(200).json({ message: "welcome to myLibrary api" });
});
module.exports = router;
//# sourceMappingURL=base.js.map