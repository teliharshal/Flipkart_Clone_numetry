const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    total: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
