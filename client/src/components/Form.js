import React from 'react'

export default function Form(props) {
  
  return (
    <form>
      <input
        placeholder = "Username" 
        type='text'
        value={props.username}
        onChange={props.onChange}
      />
      <button onClick={props.connect}>Connect</button>
    </form>
  )
}
