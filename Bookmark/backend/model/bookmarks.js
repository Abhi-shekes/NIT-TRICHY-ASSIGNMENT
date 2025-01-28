const mongoose = require('mongoose');

const bookMarkSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // references the "user" model
    required: true
  },
  title: {
    type: String,
    required: true,
    default: null
  },
  url: {
    type: String,
    required: true,
    default: null
  },
  tags: {
    type: [String], // Array of strings to store multiple tags
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Export the model
module.exports = mongoose.model("bookmarks", bookMarkSchema);
