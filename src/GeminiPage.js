import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function GeminiPage() {
  const [geminiKeywords, setGeminiKeywords] = useState([]);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then((res) => res.json())
      .then((data) => {
        // 빈도순으로 정렬 (필요에 따라 상위 N개만 추출 가능)
        const sorted = data.sort((a, b) => b.frequency - a.frequency);
        setGeminiKeywords(sorted);
      })
      .catch((err) => console.error('Gemini 키워드 로드 에러:', err));
  }, []);

  const containerStyle = {
    maxWidth: '900px',
    margin: '20px auto',
    padding: '0 20px',
    backgroundColor: '#FFFFFF',
    color: '#007BFF',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center',
    borderBottom: '2px solid #007BFF',
    paddingBottom: '10px',
    marginBottom: '20px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>뉴스 키워드 랭킹</h1>
      </div>
      <section>
        <h2>Gemini LLM 추출 키워드</h2>
        {geminiKeywords.length > 0 ? (
          <ul>
            {geminiKeywords.map(item => (
              <li key={item.id}>
                <strong>{item.keyword}</strong> - 빈도: {item.frequency}, closeness: {item.closeness}
              </li>
            ))}
          </ul>
        ) : (
          <p>키워드를 불러오는 중입니다...</p>
        )}
      </section>
      <section style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link to="/kr-wordrank">
          <button style={buttonStyle}>KR-WordRank 키워드 보기</button>
        </Link>
      </section>
    </div>
  );
}

export default GeminiPage;
