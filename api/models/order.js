const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Products", required: true },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Order", orderSchema);
