import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import WordCloud from 'react-d3-cloud';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('데이터 로드 에러:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}>로딩 중...</div>;
  }

  // 상위 20개 키워드만 가져오기 (frequency DESC)
  const sorted = [...data].sort((a, b) => b.frequency - a.frequency);
  const top20 = sorted.slice(0, 20);

  // 1) 워드클라우드용 데이터
  // react-wordcloud는 { text, value } 형태 배열
  const wordCloudData = top20.map(item => ({
    text: item.keyword,
    value: item.frequency
  }));

  // 워드클라우드 옵션
  const wordCloudOptions = {
    rotations: 2,
    rotationAngles: [-30, 30],
    fontSizes: [20, 60], // 빈도에 따른 폰트 크기 범위
  };

  // 2) 바 차트용 데이터
  const chartData = {
    labels: top20.map(item => item.keyword),
    datasets: [
      {
        label: 'Frequency',
        data: top20.map(item => item.frequency),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '키워드 Frequency (Top 20)'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="App" style={{ maxWidth: 900, margin: '20px auto' }}>
      <h1>실시간 뉴스 키워드 랭킹</h1>

      {/* 워드클라우드 영역 */}
      <div style={{ width: '100%', height: 400, marginBottom: 30 }}>
        <ReactWordcloud
          words={wordCloudData}
          options={wordCloudOptions}
        />
      </div>

      {/* 바 차트 영역 */}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default App;
