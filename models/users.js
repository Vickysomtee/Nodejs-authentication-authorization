const {Schema, model} = require("mongoose");

const bcrypt = require('bcrypt')
const saltRound = 10;

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  }
})     

// Hash password with bcrypt
UserSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, saltRound)
  next()
})

const user = model("users", UserSchema)

module.exports = user