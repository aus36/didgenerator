import maoi from './maoi.jpeg';
import sound from './did.mp3';
import './App.css';
import React, { useEffect, useMemo, useState } from 'react';
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import useSound from 'use-sound';

function generateDIDDocument(url) {
  // Generate sha 512 sync
  ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

  // Generate a key pair
  const privKey = ed.utils.randomPrivateKey();
  const pubKey = ed.getPublicKey(privKey);

  // remove commas from keys
  let privKeyNoCommas = String(privKey).replace(/,/g, '');
  let pubKeyNoCommas = String(pubKey).replace(/,/g, '');

  let id = "did:web:" + String(url);
  let didDoc = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": id,
    "verificationMethod": [
      {
        "id": "did:web:" + String(url) + "#key-0",
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

function generateVP(url) {

  // generate web DID from url
  let id = "did:web:" + String(url);

  let vp =
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "id": "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
    "type": [
      "VerifiablePresentation",
      "CredentialManagerPresentation"
    ],
    "verifiableCredentials": [
      {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "id": "http://example.edu/credentials/58473",
        "type": [
          "VerifiableCredential"
        ],
        "issuer": "https://tamuc.edu/issuers/565049",
        "issuanceDate": "2021-01-01T00:00:00Z",
        "expirationDate": "2021-01-01T00:00:00Z",
        "credentialSubject": {
          "id": id,
          "type": [
            "eldest"
          ],
          "prev": "null",
          "seqno": 0,
          "tag": "signature"
        },
        "credentialStatus": {
          "id": "https://example.edu/status/24",
          "type": "CredentialStatusList2017"
        },
        "proof": {
          "type": "Ed25519VerificationKey2020",
          "created": "2022-02-25T14:58:43Z",
          "verificationMethod": "https://example.edu/issuers/14#key-1",
          "proofPurpose": "assertionMethod",
          "proofValue": ""
        }
      },
      {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "id": "http://example.edu/credentials/58473",
        "type": [
          "VerifiableCredential"
        ],
        "issuer": "https://tamuc.edu/issuers/565049",
        "issuanceDate": "2021-01-01T00:00:00Z",
        "expirationDate": "2021-01-01T00:00:00Z",
        "credentialSubject": {
          "id": id,
          "type": [
            "web_service_binding"
          ],
          "service": {
            "name": "github", 
            "username": "exampleStudent"
          },
          "prev": "sre54g...",
          "seqno": 1,
          "tag": "signature"
        },
        "credentialStatus": {
          "id": "https://example.edu/status/24",
          "type": "CredentialStatusList2017"
        },
        "proof": {
          "type": "Ed25519VerificationKey2020",
          "created": "2022-02-25T14:58:43Z",
          "verificationMethod": "https://example.edu/issuers/14#key-1",
          "proofPurpose": "assertionMethod",
          "proofValue": ""
        }
      },
      {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "id": "http://example.edu/credentials/58473",
        "type": [
          "VerifiableCredential"
        ],
        "issuer": "https://tamuc.edu/issuers/565049",
        "issuanceDate": "2021-01-01T00:00:00Z",
        "expirationDate": "2021-01-01T00:00:00Z",
        "credentialSubject": {
          "id": id,
          "type": "revoke",
          "revoke": {
            "sig_ids": [ "038cd…", "f927c…" ]
          },
          "prev": "sre54g...",
          "seqno": 2,
          "tag": "signature"
        },
        "credentialStatus": {
          "id": "https://example.edu/status/24",
          "type": "CredentialStatusList2017"
        },
        "proof": {
          "type": "Ed25519VerificationKey2020",
          "created": "2022-02-25T14:58:43Z",
          "verificationMethod": "https://example.edu/issuers/14#key-1",
          "proofPurpose": "assertionMethod",
          "proofValue": ""
        }
      }
    ]
  }

  // output vp to console
  console.log("");
  console.log(JSON.stringify(vp, null, 2));

  // return vp back to app
  return vp;
}

function App() {
  // useState to store the url
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [didDoc, setDidDoc] = useState({});
  const [play] = useSound(sound);

  return (
    <div className="App">
      <header className="App-header">
        <img src={maoi} onClick={play} className="App-logo" alt="logo" />
        <form>
          <label>
            URL: <input name="myInput" value={url} onChange={e => setUrl(e.target.value)} />
          </label>
          <button type="submit">Submit form (actually refresh lol)</button>
        </form>
        <button onClick={() => { setDidDoc(generateDIDDocument(url)); setLoaded(true); generateVP(url)}}>Generate DID Document and VP</button>
        <code style={{ margin: 20 }}>
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
