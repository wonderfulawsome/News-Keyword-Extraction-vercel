import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// 차트에서 기본적으로 필요한 플러그인
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Render에 있는 Flask 서버의 /data 엔드포인트에서 데이터 불러오기
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(err => console.error('데이터 로드 에러:', err));
  }, []);

  // 차트에 들어갈 데이터 구성
  const chartData = {
    labels: data.map(item => item.keyword),
    datasets: [
      {
        label: 'Frequency',
        data: data.map(item => item.frequency),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Closeness',
        data: data.map(item => item.closeness),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ]
  };

  // 차트 옵션 (디자인에 따라 수정)
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '실시간 뉴스 키워드 랭킹',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ margin: '30px auto', maxWidth: '800px', textAlign: 'center' }}>
      <h1>실시간 뉴스 키워드 랭킹</h1>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default App;
