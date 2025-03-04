import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import './App.css';

function YakePage() {
  const [yakeData, setYakeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 타이머: 로딩 중에 1초마다 경과 시간 증가
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/yake')
      .then(res => res.json())
      .then(data => {
        // data: { "키워드": { score, link }, ... } → 배열로 변환 후 점수 내림차순 정렬
        const yakeArray = Object.keys(data).map(key => ({
          keyword: key,
          score: data[key].score,
          link: data[key].link,
        }));
        const sortedYake = yakeArray.sort((a, b) => a.score - b.score); // YAKE는 낮은 점수가 더 중요
        setYakeData(sortedYake);
        setLoading(false);
      })
      .catch(err => {
        console.error('YAKE 에러:', err);
        setLoading(false);
      });
  }, []);

  const barData = {
    labels: yakeData.map(item => item.keyword),
    datasets: [
      {
        label: '키워드 점수',
        data: yakeData.map(item => item.score),
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: 'YAKE 모델 키워드 점수',
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
          text: '점수',
          color: 'white'
        },
        ticks: { color: 'white' }
      },
      y: {
        title: {
          display: true,
          text: '키워드',
          color: 'white'
        },
        ticks: { color: 'white', autoSkip: true, maxTicksLimit: 20 }
      }
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const link = yakeData[index].link;
        if (link) {
          window.open(link, '_blank');
        } else {
          alert("해당 키워드와 관련된 기사를 찾을 수 없습니다.");
        }
      }
    }
  };

  return (
    <div className="container">
      <div className="header" style={{ textAlign: 'center' }}>
        <h1 className="title">YAKE 모델 키워드 결과</h1>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p>Loading... (약 10초 소요)</p>
          <p>경과 시간: {elapsedTime}초</p>
        </div>
      ) : (
        <div style={{ margin: '20px auto', maxWidth: '800px' }}>
          <Bar data={barData} options={barOptions} />
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            (각 막대를 클릭하면 해당 기사로 이동합니다)
          </p>
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

export default YakePage;
