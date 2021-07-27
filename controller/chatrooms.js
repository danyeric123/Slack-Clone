import {Chatroom} from '../models/chatroom.js'

export {
  newMessage, // newMessage checks whether a chatroom of that name exists, and if it doesn't then make said room
  getMessages,
  initializeChatrooms,
}

function initializeChatrooms(){
  Chatroom.find({name:$in["general","off-topic"]})
          .then(rooms=>{
            if(rooms.length == 0){
              // make those room
            }
          })
          .catch(err=>{
            console.log(err)
          })
}

function getMessages(roomName){
  Chatroom.find({name:roomName})
          .then(room=>{
            return room[0].messages
          })
          .catch(err=>{
            console.log(err)
          })
}

function newMessage(roomName){
  Chatroom.find({name:roomName})
          .then(rooms=>{
            if(rooms.length == 0){
              //create new room with person's name
            }
          })
}