// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // 필요한 CSS를 여기에 작성

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
