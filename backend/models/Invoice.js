const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true, default: "sai marketing" },
    shopAddress: { type: String, trim: true, default: "2, harvandan road, mumbai" },
    shopContact: { type: String, trim: true, default: "8989997796" },
    customerName: { type: String, required: true, trim: true },
    billingDate: { type: Date, required: true },
    productName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
