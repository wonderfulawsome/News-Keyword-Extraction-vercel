// src/App.js

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// 차트에서 기본적으로 필요한 플러그인들
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Chart.js에 플러그인 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  // 데이터 로딩 상태/에러 처리를 위해 추가로 State를 둘 수도 있음
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 백엔드(Flask) 서버 주소로부터 데이터를 fetch
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then(res => {
        if (!res.ok) throw new Error('서버 응답 에러');
        return res.json();
      })
      .then(data => {
        // 받아온 데이터를 차트에 필요한 형태로 가공
        const labels = data.map(item => item.keyword);
        const frequencies = data.map(item => item.frequency);
        const closeness = data.map(item => item.closeness);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Frequency',
              data: frequencies,
              backgroundColor: 'rgba(75, 192, 192, 0.6)'
            },
            {
              label: 'Closeness',
              data: closeness,
              backgroundColor: 'rgba(153, 102, 255, 0.6)'
            }
          ]
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('데이터 로드 에러:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 차트 옵션
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '실시간 뉴스 키워드 랭킹'
      },
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;
  }
  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
      에러 발생: {error}
    </div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', textAlign: 'center' }}>
      <h1>실시간 뉴스 키워드 랭킹</h1>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default App;
