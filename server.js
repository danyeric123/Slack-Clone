import express from 'express'
import {Server} from 'socket.io'
import http from 'http'
import debug from 'debug'

// create the express app
const app = express()
let server = http.createServer(app)
let io = new Server(server)
/**
 * Get port from environment and store in Express.
 */

 const port = normalizePort(process.env.PORT || '3000')
 app.set('port', port)
 
 let users = [] 
 const messages = {
   general: [],
   offtopic: [],
   
 }

io.on('connection',socket=>{
  socket.on('join-server',(username)=>{
    const user ={
      username,
      id: socket.id
    }
    users.push(user)
    io.emit("update-user-list", users)
  })

  socket.on("join-room",(roomName,cb)=>{
    socket.join(roomName)
    cb(messages[roomName])
  })
  
  socket.on("send-message",({message,recipient,sender,chatName,isChannel})=>{
    let payload = null
    if(isChannel){
      payload = {
        message,
        chatName,
        sender
      }
    }else{
      payload = {
        message,
        chatName: sender,
        sender
      }
    }
    socket.to(recipient).emit('new-message', payload)
    if(messages[chatName]){
      messages[chatName].push({
        sender,
        message
      })
    }else{
      messages[sender] = [message]
    }
  })
  socket.on('disconnnect', ()=>{
    delete chatters[socket.id]
    io.emit('update-user-list', Object.keys(chatters).map(id => chatters[id]));
  })
})


/**
 * Listen on provided port, on all network interfaces.
 */

 server.listen(port)
 server.on('error', onError)
 server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly posts
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}



