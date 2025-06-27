import { useState } from 'react';
import WebRTC from './components/WebRTC';
import Landing from './components/Landing';
import './app.css';
const App = () => {
  const [hostORClient, setHostORClient] = useState('');
  if (hostORClient === '') {
    return (
      <Landing hostORClient={hostORClient} setHostORClient={setHostORClient} />
    );
  } else {
    return (
      <WebRTC hostORClient={hostORClient} setHostORClient={setHostORClient} />
    );
  }
};

export default App;
