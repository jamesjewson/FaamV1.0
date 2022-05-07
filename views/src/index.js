import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthContextProvider } from "./context/AuthContext"

//Axios global prefix
import axios from 'axios'
axios.defaults.baseURL = 'https://faamserver.herokuapp.com/api'


ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

