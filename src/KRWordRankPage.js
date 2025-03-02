import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import './App.css';

function KRWordRankPage() {
  const [krData, setKrData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/kr-wordrank')
      .then((res) => res.json())
      .then((data) => {
        const krArray = Object.keys(data).map(key => ({
          keyword: key,
          score: data[key]
        }));
        const sortedKR = krArray.sort((a, b) => b.score - a.score);
        setKrData(sortedKR);
        setLoading(false);
      })
      .catch((err) => {
        console.error('KR-WordRank 에러:', err);
        setLoading(false);
      });
  }, []);

  const barData = {
    labels: krData.map(item => item.keyword),
    datasets: [
      {
        label: '키워드 점수',
        data: krData.map(item => item.score),
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    plugins: {
      title: {
        display: true,
        text: 'KR-WordRank 키워드 점수',
        color: 'white',
        font: { size: 18 }
      },
      legend: {
        labels: { color: 'white' }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '키워드',
          color: 'white'
        },
        ticks: { color: 'white', autoSkip: false }
      },
      y: {
        title: {
          display: true,
          text: '점수',
          color: 'white'
        },
        ticks: { color: 'white' },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="container">
      <div className="header" style={{ textAlign: 'center' }}>
        <h1 className="title">KR-WordRank 키워드 결과</h1>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div style={{ margin: '20px auto', maxWidth: '800px' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/">
          <button className="button">메인 페이지로 돌아가기</button>
        </Link>
      </div>
    </div>
  );
}

export default KRWordRankPage;
