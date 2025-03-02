import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';

function KRWordRankPage() {
  const [krData, setKrData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/kr-wordrank')
      .then((res) => res.json())
      .then((data) => {
        // data: { "키워드": 점수, ... } → 배열로 변환 및 점수 내림차순 정렬
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

  // 막대그래프 데이터 구성
  const barData = {
    labels: krData.map(item => item.keyword),
    datasets: [
      {
        label: '키워드 점수',
        data: krData.map(item => item.score),
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
        text: 'KR-WordRank 키워드 점수',
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
        <h1>KR-WordRank 키워드 결과</h1>
      </div>
      {loading ? (
        <p>키워드를 불러오는 중입니다...</p>
      ) : (
        <div style={{ marginBottom: '40px' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      )}
      <div style={{ textAlign: 'center' }}>
        <Link to="/">
          <button style={buttonStyle}>메인 페이지로 돌아가기</button>
        </Link>
      </div>
    </div>
  );
}

export default KRWordRankPage;
