import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GeminiPage from './GeminiPage';
import KRWordRankPage from './KRWordRankPage';
import YakePage from './YakePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GeminiPage />} />
        <Route path="/kr-wordrank" element={<KRWordRankPage />} />
        <Route path="/yake" element={<YakePage />} />
      </Routes>
    </Router>
  );
}

export default App;
