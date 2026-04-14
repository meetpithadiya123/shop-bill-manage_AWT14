const express = require("express");
const Invoice = require("../models/Invoice");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      shopName,
      shopAddress,
      shopContact,
      customerName,
      billingDate,
      productName,
      price,
      quantity,
    } = req.body;

    console.log("Saving Invoice Payload:", req.body);

    const priceNum = Number(price);
    const quantityNum = Number(quantity);
    const subtotal = priceNum * quantityNum;
    const total = subtotal;

    const invoice = await Invoice.create({
      shopName,
      shopAddress,
      shopContact,
      customerName,
      billingDate,
      productName,
      price: priceNum,
      quantity: quantityNum,
      subtotal,
      total,
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Invoice Save Error:", error);
    res.status(400).json({ message: "Failed to save invoice", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ billingDate: -1, createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoices", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete invoice", error: error.message });
  }
});

module.exports = router;
