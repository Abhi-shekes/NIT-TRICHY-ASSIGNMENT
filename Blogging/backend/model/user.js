const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
    username: { 
      type: String, 
      default: null 
    },
    password: { 
      type: String, 
      default: null 
    },
    email: { 
      type: String, 
      default: null 
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
      }
    ]
  });
  
  module.exports = mongoose.model("user", userSchema);