const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  title: {
    type:String,
    required: true,
    unique: true
  },
  
}, {
  autoCreate: true,
  autoIndex: true
});


module.exports = mongoose.model('Category', categorySchema);