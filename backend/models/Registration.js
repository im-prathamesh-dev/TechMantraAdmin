const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema(
  {
    clgname: String,
    name: String,
    email: String,
    class: String,
    event: String,
    cnumber: Number,
    type: String,
    participants: [String],
    pay_id: String,
    paymentStatus: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
