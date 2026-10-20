import fs from "fs";
import { generateInvoicePdf } from "./services/invoice.service.js";

const invoice = {
  invoiceNumber: "INV-TEST-0001",
  clientName: "Test Client",
  businessName: "Test Business",
  mobile: "+91 98765 43210",
  email: "test@example.com",
  billingAddress: "Madurai, Tamil Nadu, India",
  gstin: "",
  projectName: "Business Website",
  projectDescription: "5-page responsive website with online enquiry form.",
  items: [
    { name: "Website Design", description: "Responsive design with wireframes", quantity: 1, unitPrice: 30000 },
    { name: "Website Development", description: "Front-end and back-end", quantity: 1, unitPrice: 50000 },
  ],
  discount: 0,
  discountType: "flat",
  taxRate: 0,
  subtotal: 80000,
  discountAmount: 0,
  taxAmount: 0,
  totalAmount: 80000,
  amountPaid: 40000,
  balanceDue: 40000,
  invoiceDate: new Date("2026-08-10"),
  dueDate: new Date("2026-08-25"),
  notes: "",
  terms: "",
  paymentMethod: "bank_transfer",
  paymentStatus: "partial",
};

const out = await generateInvoicePdf(invoice);
const buf = fs.readFileSync(out.path);
const pageCount = (buf.toString("latin1").match(/\/Type \/Page[^s]/g) || []).length;
console.log("PDF_OK", out.path, "bytes:", buf.length, "pages:", pageCount);
