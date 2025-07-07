import { useState } from 'react';
import WebRTC from './components/WebRTC';
import Landing from './components/Landing';
import { useContext } from 'react';
import './app.css';
import { createContext } from 'react';
import { ThemeContext } from './components/ThemeContext';
const App = () => {
  
  const [theme,setTheme]=useState('white')
  const toggleTheme=()=>{setTheme(prev=>prev==='dark'?'white':'dark');console.log('theme changed')}
  const [hostORClient, setHostORClient] = useState('');
  if (hostORClient === '') {
    return (
    <ThemeContext.Provider value={{theme,toggleTheme}}>
      <Landing hostORClient={hostORClient} setHostORClient={setHostORClient}/>
      </ThemeContext.Provider >
    );
  } else {
    return (
      <ThemeContext v value={{theme,toggleTheme}}>
        <WebRTC hostORClient={hostORClient} setHostORClient={setHostORClient} theme={theme}/>
      </ThemeContext>
    );
  }
};

export default App;
