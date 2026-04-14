import { jsPDF } from "jspdf";

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const downloadInvoicePdf = (invoice) => {
  const doc = new jsPDF();
  const shopName = invoice.shopName || "SAI MARKETING";
  const shopAddress = invoice.shopAddress || "2, harvandan road, mumbai";
  const shopContact = invoice.shopContact || "8989997796";
  const accentColor = [79, 70, 229]; // Indigo-600

  // --- Background Decor ---
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.rect(0, 0, 210, 297, "F");

  // Header Accent Bar
  doc.setFillColor(...accentColor);
  doc.rect(0, 0, 210, 5, "F");

  // --- Header Area ---
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(shopName.toUpperCase(), 14, 30);

  // Invoice Badge
  doc.setFillColor(241, 245, 249); // Slate-100
  doc.roundedRect(155, 18, 40, 15, 3, 3, "F");
  doc.setTextColor(...accentColor);
  doc.setFontSize(14);
  doc.text("INVOICE", 175, 28, { align: "center" });

  // Shop Details
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(shopAddress, 14, 38);
  doc.text(`Contact: ${shopContact}`, 14, 43);

  // --- Information Grid ---
  // Horizontal Separator
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.line(14, 55, 196, 55);

  // Billing Details Box
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILLED TO", 14, 68);

  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFontSize(14);
  doc.text(invoice.customerName || "Walking Customer", 14, 76);

  // Meta Info Box
  doc.roundedRect(140, 62, 56, 25, 2, 2, "F"); // Light background for meta
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(141, 63, 54, 23, 2, 2, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("DATE", 145, 71);
  doc.text("INVOICE NO.", 145, 80);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(invoice.billingDate).toLocaleDateString(), 170, 71);
  doc.text(invoice._id ? invoice._id.toString().slice(-8).toUpperCase() : "DRAFT", 170, 708);
  // correction on y coordinate for invoice#
  doc.text(invoice._id ? invoice._id.toString().slice(-8).toUpperCase() : "PRO-001", 170, 80);

  // --- Items Table ---
  let tableY = 100;

  // Table Header
  doc.setFillColor(...accentColor);
  doc.roundedRect(14, tableY, 182, 12, 1, 1, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PRODUCT DESCRIPTION", 20, tableY + 8);
  doc.text("PRICE", 110, tableY + 8);
  doc.text("QTY", 145, tableY + 8);
  doc.text("TOTAL", 175, tableY + 8);

  // Table Content Row
  tableY += 12;
  doc.setFillColor(255, 255, 255);
  doc.rect(14, tableY, 182, 15, "F");
  doc.setDrawColor(241, 245, 249);
  doc.rect(14, tableY, 182, 15, "S");

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(invoice.productName || "Product", 20, tableY + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(formatCurrency(invoice.price), 110, tableY + 9);
  doc.text(String(invoice.quantity || 0), 145, tableY + 9);

  doc.setTextColor(...accentColor);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(invoice.total), 175, tableY + 9);

  // --- Summary Area ---
  let summaryY = tableY + 40;

  // Total Box
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(130, summaryY, 66, 15, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("GRAND TOTAL", 136, summaryY + 9);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(invoice.total), 190, summaryY + 9, { align: "right" });

  // --- Terms & Signature ---
  let footerY = 240;

  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY, 196, footerY);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TERMS & CONDITIONS", 14, footerY + 10);
  doc.setFont("helvetica", "normal");
  doc.text("1. All sales are final.", 14, footerY + 16);
  doc.text("2. Please quote invoice number for queries.", 14, footerY + 21);

  // Signature Area
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text("AUTHORISED SIGNATORY", 155, footerY + 10);
  doc.line(150, footerY + 30, 196, footerY + 30);
  doc.setFontSize(7);
  doc.text("FOR " + shopName.toUpperCase(), 173, footerY + 34, { align: "center" });

  // Bottom Footer
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 287, 210, 10, "F");
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for your business! This is a computer generated invoice.", 105, 293, { align: "center" });

  const safeName = (invoice.customerName || "invoice").replace(/\s+/g, "_");
  doc.save(`${safeName}_invoice.pdf`);
};
