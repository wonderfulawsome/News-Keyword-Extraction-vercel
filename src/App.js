import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function BubbleChart() {
  const [keywordsData, setKeywordsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/data')
      .then((res) => res.json())
      .then((json) => {
        // 빈도순 내림차순 정렬 후 상위 20개만 사용
        const sorted = json.sort((a, b) => b.frequency - a.frequency);
        const top20 = sorted.slice(0, 20);
        setKeywordsData(top20);
        setLoading(false);
      })
      .catch((err) => {
        console.error('데이터 로드 에러:', err);
        setLoading(false);
      });
  }, []);

  // Bubble 차트 데이터 구성
  const bubbleData = {
    datasets: [
      {
        label: 'Keyword Frequency',
        data: keywordsData.map((item) => ({
          x: item.keyword,       // x축에 키워드를 사용 (카테고리형)
          y: item.frequency,     // y축에 빈도
          r: item.frequency * 5  // 빈도에 따른 버블 크기 (필요에 따라 조정)
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
            const keyword = context.raw.x;
            const freq = context.raw.y;
            return `${keyword}: ${freq}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Keyword'
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45
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

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading data...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Keyword Bubble Chart (Top 20)</h2>
      {keywordsData.length > 0 ? (
        <Bubble data={bubbleData} options={options} />
      ) : (
        <p>No keyword data available.</p>
      )}
    </div>
  );
}

export default BubbleChart;
