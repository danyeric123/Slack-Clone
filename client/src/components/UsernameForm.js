import React from 'react'
import { Container, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/esm/Button'

export default function UsernameForm(props) {
  function handleKeyPress(e){
    if(e.key==='Enter'){
      props.connect()
    }
  }
  return (
    <Container class="justify-content-md-center" fluid>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="text" 
            value={props.username}
            onKeyPress={handleKeyPress}
            onChange={props.onChange}
            placeholder="Username" />
        </Form.Group>
        <Button variant='primary' onClick={props.connect}>Connect</Button>
      </Form>
    </Container>
  )
}
