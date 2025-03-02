import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function GeminiPage() {
  const [geminiKeywords, setGeminiKeywords] = useState([]);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then((res) => res.json())
      .then((data) => {
        // 빈도순 정렬 (숫자는 내부 데이터이므로 표시하지 않습니다)
        const sorted = data.sort((a, b) => b.frequency - a.frequency);
        setGeminiKeywords(sorted);
      })
      .catch((err) => console.error('Gemini 키워드 로드 에러:', err));
  }, []);

  return (
    <div className="container fade-in">
      <div className="header">
        <h1>뉴스 키워드 랭킹</h1>
      </div>
      <section>
        <h2>Gemini LLM 추출 키워드</h2>
        {geminiKeywords.length > 0 ? (
          <ul>
            {geminiKeywords.map(item => (
              <li key={item.id}>{item.keyword}</li>
            ))}
          </ul>
        ) : (
          <p>키워드를 불러오는 중입니다...</p>
        )}
      </section>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/kr-wordrank">
          <button className="button">KR-WordRank 키워드 보기</button>
        </Link>
      </div>
    </div>
  );
}

export default GeminiPage;
