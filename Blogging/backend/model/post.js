const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { 
      type: String, 
      default: null 
    },
    content: { 
      type: String, 
      default: null 
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    authorName: {
      type: String,
      default: null
    }
  });
  
  module.exports = mongoose.model("post", postSchema);