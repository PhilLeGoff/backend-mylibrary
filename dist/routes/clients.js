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
require("../models/connection");
const clients_1 = require("../models/clients");
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phoneNumber, loans } = req.body;
    const newPhoneNumber = phoneNumber.replace(/\D/g, "");
    console.log(phoneNumber);
    try {
        const clientFound = yield clients_1.Client.findOne({
            fullName: fullName,
            phoneNumber: newPhoneNumber,
        });
        if (!clientFound) {
            yield clients_1.Client.create({
                fullName: fullName,
                phoneNumber: newPhoneNumber,
                loans: loans,
            }).then(() => res.status(201).json({
                success: true,
                message: `Created client document for ${fullName} with phone number: ${phoneNumber}`,
            }));
        }
        else
            res
                .status(201)
                .json({ success: false, message: "Client already in myLibrary" });
    }
    catch (error) {
        console.error("Error adding client:", error);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
}));
router.get("/:option/:input", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { option, input } = req.params;
    try {
        let query = {};
        switch (option) {
            case "name":
                query = { fullName: { $regex: input, $options: "i" } };
                break;
            case "phoneNumber":
                input.replace(/\D/g, "");
                query = { phoneNumber: { $regex: input, $options: "i" } };
                break;
        }
        const clients = yield clients_1.Client.find(query);
        if (!clients || clients.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "No books found" });
        const clientsData = clients.map((client) => ({
            clientId: client._id,
            fullName: client.fullName,
            phoneNumber: client.phoneNumber,
            booksLoaned: client.booksLoaned,
        }));
        console.log("clientsData", clientsData);
        return res.status(200).json({ success: true, clients: clientsData });
    }
    catch (error) {
        console.error("Error finding client:", error);
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
}));
router.get('/fulldata/:fullName/:phoneNumber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phoneNumber } = req.params;
    phoneNumber.replace(/\D/g, "");
    console.log("in");
    try {
        const clientFound = yield clients_1.Client.findOne({ fullName: fullName, phoneNumber: phoneNumber }).populate("booksLoaned");
        console.log(clientFound);
        if (clientFound) {
            res.json({ success: true, clientDetails: clientFound });
        }
        else {
            res.status(404).json({ success: false, message: "Client not found" });
        }
    }
    catch (error) {
        console.error("Error getting client full data:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}));
module.exports = router;
//# sourceMappingURL=clients.js.map