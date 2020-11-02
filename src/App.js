import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = '';
// Intercepter de las petciones.
axios.interceptors.request.use(
  config => {
    const { origin } = new URL(config.url);
    const allowedOrigins = [apiUrl];
    const token = localStorage.getItem('token');
    if (!allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);



function App() {

  const storedJwt = localStorage.getItem('token');
  const [jwt, setJwt] = useState(storedJwt || null);
  const [tracks, setTracks] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const username = ''
  const password = '' 
  const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

  // Sign in 

  const getJwt = async () => {
    const { data } = await axios.post(`${apiUrl}/auth/sign-in`,
      {
        "apiKeyToken":""
      },
      {
        headers: {
        'Authorization': `Basic ${token}`
      },
    });
    localStorage.setItem('token', data.body.token);
    setJwt(data.body.token);
  };

  // logicas de cada componente

const getTracks = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/track`);
      setTracks(data.body.tracks);
      console.log(data.body);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

    // logicas de cada componente
const getAlbums = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/album`);
      // setTracks(data.body);
      console.log(data.body);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  return (
    <div className="App">
         <section style={{ marginBottom: '10px' }}>
        <button onClick={() => getJwt()}>Get JWT</button>
        {jwt && (
          <pre>
            <code>{jwt}</code>
          </pre>
        )}
      </section>
      <section>
        <button onClick={() => getTracks()}>
          Get tracks
        </button>
        <button onClick={() => getAlbums()}>
          Get Albums
        </button>
        <ul>
          {tracks.map((Tracks, i) => (
            <li>{Tracks.title}</li>
          ))}
        </ul>
        {fetchError && (
          <p style={{ color: 'red' }}>{fetchError}</p>
        )}
      </section>
    </div>
  );
}

export default App;
