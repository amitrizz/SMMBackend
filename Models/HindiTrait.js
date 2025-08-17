const mongoose = require("mongoose");

const traitSchema = new mongoose.Schema({
    name: String,
    score: Number,
    description: String,
    action: String,
    category: String, // just a plain string now
    career: String,   // just a plain string now
});

module.exports = mongoose.model("HindiTrait", traitSchema);
