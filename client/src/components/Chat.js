import React from 'react'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button'
import { BiChat, BiHash } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { Card, Container, FormControl, ListGroup, Nav, Navbar } from 'react-bootstrap';

const rooms=[
  "general",
  "offtopic"
]


const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

export default function Chat(props) {
  
  function difference(message) {
    let postDate = message.createdAt
    let difference = Date.now() - postDate
    if(difference<10000){
      return "less than a second"
    }else if (difference<60000) {
      return `${Math.floor(difference/10000)} seconds`
    }else if (difference<3600000) {
      return `${Math.floor(difference/60000)} minutes`
    }else if (difference<86400000) {
      return `${Math.floor(difference/3600000)} hours`
    }else if (difference<604800000) {
      return `${Math.floor(difference/86400000)} days`
    }else if (difference<2628000000) {
      return `${Math.floor(difference/604800000)} weeks`
    }else if (difference<31540000000) {
      return `${Math.floor(difference/2628000000)} months`
    }else{
      return `${Math.floor(difference/31540000000)} years`
    }
  }

  function renderRooms(room){
    const currentChat = {
      chatName: room,
      isChannel: true,
      recieverId:""
    }
    return (
      <Nav.Item onClick={()=>props.toggleChat(currentChat)} key={room}>
       <BiHash/> {room}
      </Nav.Item>
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
      <Card key={index}>
        <Card.Body>
          <Card.Title>{message.sender}</Card.Title>
          <Card.Text>{message.message}</Card.Text>
          <footer className="text-muted">{difference(message)} ago</footer>
        </Card.Body>
      </Card>
    )
  }

  function handleKeyPress(e){
    if(e.key==='Enter'){
      props.sendMessage()
    }
  }

  let body
  if(!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)){
    body = (
      <ListGroup
        style={{height:"75%", overflow:"scroll"}}
      >
        {props.messages.map(renderMessages)}
      </ListGroup>
    )
  }else{
    body = (
      <Button variant="success" onClick={()=>props.joinRoom(props.currentChat.chatName)}>
        Join {props.currentChat.chatName}
      </Button>
    )
  }

  return (
      <Container 
        className="d-flex"
        style={{height:"100vh",width:"100vh"}}
      >
        <Navbar bg="light" expand="lg"className="flex-column">
          <Nav.Item className="mb-3">
            <Navbar.Brand>
              <BiChat/>  Channels
            </Navbar.Brand>
            {rooms.map(renderRooms)}
          </Nav.Item>
          <Nav.Item className="mb-3">
            <Navbar.Brand>
              <FiUsers/>Online Users
            </Navbar.Brand>
            {props.allUsers.map(renderUser)}
          </Nav.Item>
        </Navbar>
        <ChatPanel>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>
              #  {props.currentChat.chatName}
            </Navbar.Brand>
          </Navbar>
            {body}
          <FormControl
            as="textarea" 
            style={{height:"15%"}}
            value={props.message}
            onChange={props.handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${props.currentChat.chatName}`}
          />
        </ChatPanel>
      </Container>
  )
}
