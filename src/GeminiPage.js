import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function GeminiPage() {
  const [geminiKeywords, setGeminiKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.frequency - a.frequency);
        setGeminiKeywords(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gemini 키워드 로드 에러:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-title">실시간 뉴스 키워드</div>
        <div className="nav-links">
          <Link to="/kr-wordrank" className="button">KR-WordRank Model</Link>
        </div>
      </nav>
      <div className="container">
        <h2 style={{ textAlign: 'center' }}>Gemini LLM 추출 키워드</h2>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : geminiKeywords.length > 0 ? (
          <div className="keyword-chips">
            {geminiKeywords.map(item => (
              <div key={item.id} className="keyword-chip">
                {item.keyword}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center' }}>키워드를 불러오는 중입니다...</p>
        )}
      </div>
    </>
  );
}

export default GeminiPage;
