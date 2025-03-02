import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function GeminiPage() {
  const [geminiKeywords, setGeminiKeywords] = useState([]);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then((res) => res.json())
      .then((data) => {
        // 빈도순 정렬 (숫자는 내부 데이터이므로 여기서는 키워드만 표시)
        const sorted = data.sort((a, b) => b.frequency - a.frequency);
        setGeminiKeywords(sorted);
      })
      .catch((err) => console.error('Gemini 키워드 로드 에러:', err));
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">실시간 뉴스 키워드</h1>
        <div>
          <Link to="/kr-wordrank">
            <button className="button">KR-WordRank Model</button>
          </Link>
        </div>
      </div>
      <section>
        <h2>Gemini LLM 추출 키워드</h2>
        {geminiKeywords.length > 0 ? (
          <div className="keyword-grid">
            {geminiKeywords.map(item => (
              <div key={item.id} className="keyword-card">
                {item.keyword}
              </div>
            ))}
          </div>
        ) : (
          <p>키워드를 불러오는 중입니다...</p>
        )}
      </section>
    </div>
  );
}

export default GeminiPage;
