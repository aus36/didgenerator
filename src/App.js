import maoi from './maoi.jpeg';
import './App.css';
import React, { useState } from 'react';

function App() {
  // useState to store the url
  const [url, setUrl] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <img src={maoi} className="App-logo" alt="logo"/>
        <form style={{margin:10, display:"flex", flexDirection: 'column'}}>
          <input onChange={setUrl} placeholder='enter your did url here:'>
          </input>
          There will be fields here to enter info for the did
        </form>
        <button style = {{margin:10}}>
          A button here will generate a did
        </button>
      </header>
    </div>
  );
}

export default App;