import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import './App.css';

function CulturePage() {
  const category = "문화";
  const [kowordrankData, setKoWordRankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [loading]);

  useEffect(() => {
    fetch(`https://news-keyword-extraction.onrender.com/kowordrank?category=${category}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('API 에러:', data.error);
          setLoading(false);
          return;
        }
        const wordArray = Object.keys(data).map(key => ({
          keyword: key,
          score: data[key].score,
          link: data[key].link
        }));
        const sorted = wordArray.sort((a, b) => b.score - a.score);
        setKoWordRankData(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error('KoWordRank 에러:', err);
        setLoading(false);
      });
  }, [category]);

  const barData = {
    labels: kowordrankData.map(item => item.keyword),
    datasets: [
      {
        label: '키워드 점수',
        data: kowordrankData.map(item => item.score),
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `KoWordRank 모델 키워드 결과 - ${category}`,
        color: 'white',
        font: { size: 18 }
      },
      legend: { labels: { color: 'white' } }
    },
    scales: {
      x: { title: { display: true, text: '점수', color: 'white' }, ticks: { color: 'white' } },
      y: { title: { display: true, text: '키워드', color: 'white' }, ticks: { color: 'white' } }
    }
  };

  return (
    <div className="container">
      {/* ... navbar, loading ... */}
      {loading ? (
        // ...
      ) : (
        <div style={{ margin: '20px auto', maxWidth: '900px' }}>
          <div style={{ width: '1000px', height: '600px', margin: '0 auto' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      )}
      {/* ... */}
    </div>
  );
}

export default CulturePage;
