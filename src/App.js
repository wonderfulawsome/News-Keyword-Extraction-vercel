import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function App() {
  const [geminiData, setGeminiData] = useState([]);
  const [krData, setKrData] = useState(null);
  const [loadingKR, setLoadingKR] = useState(false);

  // 앱 로드시 Gemini LLM 키워드 데이터를 불러옵니다.
  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then((res) => res.json())
      .then((json) => {
        // 빈도순 정렬 후 상위 20개 키워드만 사용
        const sorted = json.sort((a, b) => b.frequency - a.frequency);
        const top20 = sorted.slice(0, 20);
        setGeminiData(top20);
      })
      .catch((err) => console.error('Gemini 키워드 로드 에러:', err));
  }, []);

  // KR-WordRank 버튼 클릭 시 호출되는 함수
  const handleKRButtonClick = () => {
    setLoadingKR(true);
    fetch('https://news-keyword-extraction.onrender.com/kr-wordrank')
      .then((res) => res.json())
      .then((json) => {
        setKrData(json);
        setLoadingKR(false);
      })
      .catch((err) => {
        console.error('KR-WordRank 에러:', err);
        setLoadingKR(false);
      });
  };

  // Bubble Chart용 데이터 구성 (Gemini LLM 결과)
  const bubbleData = {
    datasets: [
      {
        label: 'Gemini LLM Keyword Frequency',
        data: geminiData.map((item, index) => ({
          x: index + 1,          // x축: 순번
          y: item.frequency,     // y축: 빈도수
          r: item.frequency * 5, // 빈도에 따른 버블 크기
          keyword: item.keyword  // 툴팁용 키워드
        })),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const bubbleOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const keyword = context.raw.keyword || '';
            const freq = context.raw.y;
            return `${keyword}: ${freq}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Keyword Index'
        },
        ticks: {
          autoSkip: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Frequency'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 10px' }}>
      <h1>뉴스 키워드 랭킹</h1>

      {/* Gemini LLM 키워드 Bubble Chart 영역 */}
      <section>
        <h2>Gemini LLM 추출 키워드 (Bubble Chart)</h2>
        {geminiData.length > 0 ? (
          <Bubble data={bubbleData} options={bubbleOptions} />
        ) : (
          <p>Gemini LLM 키워드를 불러오는 중입니다...</p>
        )}
      </section>

      {/* KR-WordRank 결과 영역 */}
      <section style={{ marginTop: '40px' }}>
        <h2>KR-WordRank 추출 키워드</h2>
        <button onClick={handleKRButtonClick} disabled={loadingKR}>
          {loadingKR ? '처리 중...' : 'KR-WordRank 실행'}
        </button>
        {krData && (
          <div style={{ marginTop: '20px' }}>
            <h3>추출된 KR-WordRank 키워드</h3>
            <pre>{JSON.stringify(krData, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
