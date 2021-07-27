import mongoose from 'mongoose'
const Schema = mongoose.Schema;

export {
  User
}

const userSchema = new Schema({
  username: String,
  id: String
})

const User = mongoose.model("User", userSchema);