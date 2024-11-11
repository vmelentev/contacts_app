const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name: String,
    email: String
}, {collection: 'contacts'})

module.exports = mongoose.model("User", userSchema)