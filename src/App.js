import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WholePage from './WholePage';
import PoliticsPage from './PoliticsPage';
import EconomyPage from './EconomyPage';
import SocietyPage from './SocietyPage';
import WorldPage from './WorldPage';
import CulturePage from './CulturePage';
import EntertainmentPage from './EntertainmentPage';
import SportsPage from './SportsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WholePage />} />
        <Route path="/politics" element={<PoliticsPage />} />
        <Route path="/economy" element={<EconomyPage />} />
        <Route path="/society" element={<SocietyPage />} />
        <Route path="/world" element={<WorldPage />} />
        <Route path="/culture" element={<CulturePage />} />
        <Route path="/entertainment" element={<EntertainmentPage />} />
        <Route path="/sports" element={<SportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
