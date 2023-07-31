import maoi from './maoi.jpeg';
import './App.css';
import React, { useState } from 'react';
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';

function generateDIDDocument(url) {
  // Generate a sha idk what that means
  ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

  // Generate a key pair
  const privKey = ed.utils.randomPrivateKey();
  const pubKey = ed.getPublicKey(privKey);

  // remove commas from keys
  let privKeyNoCommas = String(privKey).replace(/,/g, '');
  let pubKeyNoCommas = String(pubKey).replace(/,/g, '');

  let id = "did:web:"+String(url);
  let didDoc = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": id,
    "verificationMethod": [
      {
        "id": "did:web:"+String(url)+"#key-0",
        "type": "ed25519VerificationKey2020",
        "controller": id,
        "publicKeyBase58": pubKeyNoCommas
      }
    ],
    "authentication": [
      "did:web:example.com#key-0"
    ],
    "assertionMethod": [
      "did:web:example.com#key-0"
    ],
    "keyAgreement": [
      "did:web:example.com#key-0"
    ]
  }
  console.log(JSON.stringify(didDoc, null, 2));

  return didDoc;
}

function App() {
  // useState to store the url
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [didDoc, setDidDoc] = useState({});

  return (
    <div className="App">
      <header className="App-header">
        <img src={maoi} className="App-logo" alt="logo"/>
        <form>
          <label>
            URL: <input name="myInput" value = {url} onChange = {e => setUrl(e.target.value)}/>
          </label>
          <button type="submit">Submit form (actually refresh lol)</button>
        </form>
        <button onClick={() => {setDidDoc(generateDIDDocument(url)); setLoaded(true);}}>Generate DID Document</button>
        <code style={{margin:20}}>
          {loaded
          ? JSON.stringify(didDoc, null, 2)
          : "not loaded yet"
          }
        </code>
      </header>
    </div>
  );
}

export default App;