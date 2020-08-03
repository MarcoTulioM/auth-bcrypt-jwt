import React, { useState } from 'react';
import api from './api';
import './styles.css';

export default function App () {

  const [ name, setName ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ resp, setResp ] = useState('#9ab2b6'); 

  async function submitHandle ( event ) {

    event.preventDefault();

    const data = { 
      'name': name, 
      'password': password 
    }; 

    await api.post('users/login', { data }).then( ( response) => {

      console.log( response.data );

      let color = ( response.data.token ) ? "green" : "red";
      setResp( color );
    });

    setName("");
    setPassword("");
  }

  return (
    <div className='container'>
      <h1> Authetication: </h1>
      <form onSubmit={ submitHandle }>

        <input
          type='text' 
          placeholder='Login'
        
          value={ name }
          onChange={ ( event ) => setName( event.target.value ) }
        />

        <input 
          type='password' 
          placeholder='Password'
          
          value={ password }
          onChange={ ( event ) => setPassword( event.target.value ) }
        />
        <div className="buttonsConatiner">
          <button type='submit'> Send </button>
          <span style={{backgroundColor: resp}}/>
        </div>
      </form>
    </div>
  );
}