import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import YakePage from './YakePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 경로는 전체 카테고리 */}
        <Route path="/" element={<YakePage />} />
        <Route path="/yake/:category" element={<YakePage />} />
      </Routes>
    </Router>
  );
}

export default App;
