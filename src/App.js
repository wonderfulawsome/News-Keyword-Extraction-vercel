import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function App() {
  // Gemini LLM 결과 (리스트용)
  const [geminiKeywords, setGeminiKeywords] = useState([]);
  // KR-WordRank 결과 (막대그래프용, 배열 형태)
  const [krData, setKrData] = useState(null);
  const [loadingKR, setLoadingKR] = useState(false);

  // 앱 로드시 Gemini LLM 키워드를 /data 엔드포인트에서 불러옴
  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then((res) => res.json())
      .then((data) => {
        // 빈도순으로 정렬하여 표시 (필요시 상위 20개만)
        const sorted = data.sort((a, b) => b.frequency - a.frequency);
        setGeminiKeywords(sorted);
      })
      .catch((err) => console.error('Gemini 키워드 로드 에러:', err));
  }, []);

  // KR-WordRank 버튼 클릭 시 호출되는 함수
  const fetchKRWordRank = () => {
    setLoadingKR(true);
    fetch('https://news-keyword-extraction.onrender.com/kr-wordrank')
      .then((res) => res.json())
      .then((data) => {
        // data는 { keyword: score, ... } 형식이므로 배열로 변환 후 score 내림차순 정렬
        const krArray = Object.keys(data).map(key => ({
          keyword: key,
          score: data[key]
        }));
        const sortedKR = krArray.sort((a, b) => b.score - a.score);
        setKrData(sortedKR);
        setLoadingKR(false);
      })
      .catch((err) => {
        console.error('KR-WordRank 에러:', err);
        setLoadingKR(false);
      });
  };

  // KR-WordRank 결과를 막대그래프로 시각화 (X축: 키워드, Y축: 점수)
  const barData = {
    labels: krData ? krData.map(item => item.keyword) : [],
    datasets: [
      {
        label: '키워드 점수',
        data: krData ? krData.map(item => item.score) : [],
        backgroundColor: 'rgba(0,123,255,0.6)',
        borderColor: 'rgba(0,123,255,1)',
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    plugins: {
      title: {
        display: true,
        text: 'KR-WordRank 키워드 점수 (상위)',
        color: '#007BFF',
        font: { size: 18 }
      },
      legend: {
        labels: { color: '#007BFF' }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '키워드',
          color: '#007BFF'
        },
        ticks: { color: '#007BFF', autoSkip: false }
      },
      y: {
        title: {
          display: true,
          text: '점수',
          color: '#007BFF'
        },
        ticks: { color: '#007BFF' },
        beginAtZero: true
      }
    }
  };

  // 전체 앱 스타일 (블루/화이트 테마)
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

  const sectionStyle = { marginBottom: '40px' };

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

      {/* Gemini LLM 키워드 섹션 */}
      <section style={sectionStyle}>
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

      {/* KR-WordRank 결과 섹션 */}
      <section style={sectionStyle}>
        <h2>KR-WordRank 키워드 점수 (막대그래프)</h2>
        <button style={buttonStyle} onClick={fetchKRWordRank} disabled={loadingKR}>
          {loadingKR ? '처리 중...' : 'KR-WordRank 실행'}
        </button>
        {krData && krData.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
