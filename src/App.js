import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function BubbleChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then((res) => res.json())
      .then((json) => {
        // 빈도순 정렬 후 상위 20개만 사용
        const sorted = json.sort((a, b) => b.frequency - a.frequency);
        const top20 = sorted.slice(0, 20);
        setData(top20);
      })
      .catch((err) => console.error('데이터 로드 에러:', err));
  }, []);

  // 버블 차트 데이터 구성
  const bubbleData = {
    datasets: [
      {
        label: 'Keyword Frequency',
        data: data.map((item, index) => ({
          x: index + 1,          // x축에 순번 또는 다른 값을 넣을 수 있음
          y: item.frequency,     // y축에 frequency
          r: item.frequency * 5, // 빈도에 따라 버블 크기를 조정
          keyword: item.keyword  // 추후 tooltip에 활용할 수 있음
        })),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
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
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Keyword Bubble Chart</h2>
      <Bubble data={bubbleData} options={options} />
    </div>
  );
}

export default BubbleChart;
