import React, {useState, useRef,useEffect} from 'react';
import UsernameForm from './components/UsernameForm.js'
import Chat from './components/Chat.js'
import io from 'socket.io-client'
import immer from 'immer' 
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const initialMessageState = {
    general: [],
    offtopic: [],
    
  }
  const [username, setUsername] = useState('')
  const [connected, setConnected] = useState(false)
  const [currentChat, setCurrentChat] = useState({isChannel:true,chatName: 'general',recieverId:''})
  const [connectedRooms, setConnectedRooms] = useState(["general"])
  const [allUsers, setAllUsers] = useState([])
  const [messages, setMessages] = useState(initialMessageState)
  const [message, setMessage] = useState("")
  const socketRef = useRef()

  function handleMessageChange(e){
    setMessage(e.target.value)
  }

  function handleChange(e){
    setUsername(e.target.value)
  }

  useEffect(() => {
    setMessage('')
  }, [messages])

  function sendMessage(){
    const payload ={
      message: message,
      recipient: currentChat.isChannel ? currentChat.chatName:currentChat.recieverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel
    }
    socketRef.current.emit('send-message',payload)
    const newMessage = immer(messages, draft=>{
      draft[currentChat.chatName].push({
        sender: username,
        message: message,
        createdAt: new Date()
      })
    })
    setMessages(newMessage)
  }

  function roomJoinCallback(incomingMessages, room){
    const newMessages = immer(messages,draft=>{
      draft[room]=incomingMessages
    })
    setMessages(newMessages)
  }

  function joinRoom(room){
    const newConnectedRooms = immer(connectedRooms, draft=>{
      draft.push(room)
    })

    socketRef.current.emit("join-room", room, (messages)=>roomJoinCallback(messages,room))
    setConnectedRooms(newConnectedRooms)
  }

  function toggleChat(currentChat){
    if(!messages[currentChat.chatName]){
      const newMessages = immer(messages,draft=>{
        draft[currentChat.chatName] = []
      })
      setMessages(newMessages)
    }
    setCurrentChat(currentChat)
  }
  
  function connect(){
    setConnected(true)
    socketRef.current = io.connect('/')
    let currentSocket = socketRef.current
    currentSocket.emit('join-server',username)
    currentSocket.emit('join-room','general', messages=>roomJoinCallback(messages,'general'))
    currentSocket.on('update-user-list', allUsers=>{
      setAllUsers(allUsers)
    })
    currentSocket.on('new-message',({message,sender,chatName})=>{
      setMessages(messages=>{
        const newMessages = immer(messages, draft=>{
          if(draft[chatName]){
            draft[chatName].push({message,sender})
          }else{
            draft[chatName] = [{message,sender}]
          }
        })
        return newMessages
      })
    })
  }

  let body
  if(connected){
    body = (<Chat 
              message={message}
              handleMessageChange={handleMessageChange}
              sendMessage = {sendMessage}
              yourId={socketRef.current?socketRef.current.id:""}
              allUsers={allUsers}
              joinRoom={joinRoom}
              connectedRooms={connectedRooms}
              currentChat ={currentChat}
              toggleChat={toggleChat}
              messages={messages[currentChat.chatName]}
            />)
  }else{
    body =(
      <UsernameForm username={username} onChange={handleChange} connect={connect} />
    )
  }
  
  return (
    <div className="App">
      {body}
    </div>
  );
}

export default App;
