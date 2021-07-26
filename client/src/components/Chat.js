import React from 'react'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button'
import { FormControl, ListGroup, Nav, Navbar } from 'react-bootstrap';

const rooms=[
  "general",
  "offtopic"
]

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

const TextBox = styled.textarea`
    height: 15%;
    width: 100%;
`;

const Row = styled.div`
    cursor: pointer;
`;

export default function Chat(props) {
  
  function renderRooms(room){
    const currentChat = {
      chatName: room,
      isChannel: true,
      recieverId:""
    }
    return (
      <Row onClick={()=>props.toggleChat(currentChat)} key={room}>
        {room}
      </Row>
    )
  }

  function renderUser(user){
    if(user.id===props.yourId){
      return (
        <Nav.Item key={user.id}>
          <strong>{user.username}</strong>
        </Nav.Item>
      )
    }
    const currentChat = {
      chatName: user.username,
      isChannel: false,
      recieverId: user.id
    }
    return (
      <Nav.Item onClick={()=>{
        props.toggleChat(currentChat)
      }} key = {user.id}>
        {user.username}
      </Nav.Item>
    )
  }

  function renderMessages(message,index){
    return (
      <div key={index}>
        <h3>{message.sender}</h3>
        <p>{message.message}</p>
      </div>
    )
  }

  function handleKeyPress(e){
    if(e.key==='Enter'){
      props.sendMessage()
    }
  }

  let body
  if(!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)){
    console.log(props)
    body = (
      <ListGroup.Item>
        {props.messages.map(renderMessages)}
      </ListGroup.Item>
    )
  }else{
    body = (
      <Button variant="success" onClick={()=>props.joinRoom(props.currentChat.chatName)}>
        Join {props.currentChat.chatName}
      </Button>
    )
  }

  return (
    <div>
      <Container>
        <Navbar bg="light" expand="lg"className="flex-column">
          <h3>Channels</h3>
          {rooms.map(renderRooms)}
          <h3>All Users</h3>
          {props.allUsers.map(renderUser)}
        </Navbar>
        <ChatPanel>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>
              #  {props.currentChat.chatName}
            </Navbar.Brand>
          </Navbar>
          <ListGroup>
            {body}
          </ListGroup>
          <FormControl
            as="textarea" 
            value={props.message}
            onChange={props.handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${props.currentChat.chatName}`}
          />
        </ChatPanel>
      </Container>
    </div>
  )
}
