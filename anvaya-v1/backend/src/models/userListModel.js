const mongoose = require("mongoose");

const myListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  cards: [
    {
      id: String,       // or another unique identifier
      number: String,
      name: String
    }
  ]
});

module.exports = mongoose.model("UserList", myListSchema);
