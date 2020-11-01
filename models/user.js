const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); //using passport-local-mongoose for building username and password login with passport

//creating user schema
const User = new Schema({
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
});

//using passport-local-mongoose plugin
User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
