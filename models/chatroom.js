import mongoose from 'mongoose'
const Schema = mongoose.Schema;

export {
  Chatroom
}

const chatroomSchema = new Schema({
  name: String,
  messages: [messageSchema]
})

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  message: String,
},{
  timestamps: true,
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);