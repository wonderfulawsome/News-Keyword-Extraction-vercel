import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import './App.css';

function KRWordRankPage() {
  const [krData, setKrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 타이머: 로딩 중이면 1초마다 경과시간 업데이트
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  // KR-WordRank 데이터 불러오기
  useEffect(() => {
    fetch('https://news-keyword-extraction.onrender.com/kr-wordrank')
      .then((res) => res.json())
      .then((data) => {
        // data: { "키워드": {score: X, link: "URL"}, ... } → 배열로 변환 및 내림차순 정렬
        const krArray = Object.keys(data).map((key) => ({
          keyword: key,
          score: data[key].score,
          link: data[key].link,
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

  // 수평 막대그래프 데이터 구성
  const barData = {
    labels: krData.map((item) => item.keyword),
    datasets: [
      {
        label: '키워드 점수',
        data: krData.map((item) => item.score),
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y', // 수평 막대그래프
    plugins: {
      title: {
        display: true,
        text: 'KR-WordRank 키워드 점수',
        color: 'white',
        font: { size: 18 },
      },
      legend: {
        labels: { color: 'white' },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '점수',
          color: 'white',
        },
        ticks: { color: 'white' },
      },
      y: {
        title: {
          display: true,
          text: '키워드',
          color: 'white',
        },
        ticks: {
          color: 'white',
          autoSkip: true,
          maxTicksLimit: 20,
        },
      },
    },
    // 차트 클릭 시 처리하는 이벤트 핸들러
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const link = krData[index].link;
        if (link) {
          window.open(link, '_blank');
        } else {
          alert("해당 키워드와 관련된 기사를 찾을 수 없습니다.");
        }
      }
    },
  };

  return (
    <div className="container">
      <div className="header" style={{ textAlign: 'center' }}>
        <h1 className="title">KR-WordRank 키워드 결과</h1>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p>Loading... (약 3분 소요)</p>
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

export default KRWordRankPage;
