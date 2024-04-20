var express = require("express");
var router = express.Router();
import { Request, Response } from "express";

require("../models/connection");
import { Client } from "../models/clients";

router.post("/", async (req: Request, res: Response) => {
  const { fullName, phoneNumber, loans } = req.body;
  const newPhoneNumber = phoneNumber.replace(/\D/g, "");
  console.log(phoneNumber)


  try {
    const clientFound = await Client.findOne({
      fullName: fullName,
      phoneNumber: newPhoneNumber,
    });

    if (!clientFound) {
      await Client.create({
        fullName: fullName,
        phoneNumber: newPhoneNumber,
        loans: loans,
      }).then(() =>
        res.status(201).json({
          success: true,
          message: `Created client document for ${fullName} with phone number: ${phoneNumber}`,
        })
      );
    } else
      res
        .status(201)
        .json({ success: false, message: "Client already in myLibrary" });
  } catch (error) {
    console.error("Error adding client:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.get("/:option/:input", async (req: Request, res: Response) => {
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

    const clients = await Client.find(query);

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
  } catch (error) {
    console.error("Error finding client:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.get('/fulldata/:fullName/:phoneNumber', async (req: Request, res: Response) => {
  const {fullName, phoneNumber} = req.params
  phoneNumber.replace(/\D/g, "");
  console.log("in")

  try {
    const clientFound = await Client.findOne({ fullName: fullName, phoneNumber: phoneNumber }).populate("booksLoaned");
    console.log(clientFound)
    if (clientFound) {
      res.json({ success: true, clientDetails: clientFound });
    } else {
      res.status(404).json({ success: false, message: "Client not found" });
    }
  } catch (error) {
    console.error("Error getting client full data:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
})

module.exports = router;
