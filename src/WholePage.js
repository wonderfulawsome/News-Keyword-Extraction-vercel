import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import './App.css';

function WholePage() {
  const category = "전체";
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
    // /kowordrank?category=... 로 수정
    fetch(`https://news-keyword-extraction.onrender.com/kowordrank?category=${category}`)
      .then(res => res.json())
      .then(data => {
        // 데이터 { 키워드: {score, link}, ... } 형태
        const wordArray = Object.keys(data).map(key => ({
          keyword: key,
          score: data[key].score,
          link: data[key].link,
        }));
        // KoWordRank 점수는 일반적으로 높을수록 중요하지만,
        // 원 코드 구조(필터링 등)에 따라 정렬 방향 정하시면 됩니다.
        // 예시로 'score' 내림차순으로 정렬:
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
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y', // 가로 막대
    plugins: {
      title: {
        display: true,
        text: `KoWordRank 모델 키워드 결과 - ${category}`,
        color: 'white',
        font: { size: 18 }
      },
      legend: {
        labels: { color: 'white' }
      }
    },
    scales: {
      x: {
        title: { display: true, text: '점수', color: 'white' },
        ticks: { color: 'white' }
      },
      y: {
        title: { display: true, text: '키워드', color: 'white' },
        ticks: { color: 'white', autoSkip: true, maxTicksLimit: 20 }
      }
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const link = kowordrankData[index].link;
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
      <div className="navbar">
        <div className="nav-title">실시간 뉴스 키워드</div>
        <div className="nav-links">
          {/* 전체 페이지는 / 경로 */}
          <Link to="/" className="button">전체</Link>
          <Link to="/politics" className="button" style={{ marginLeft: '10px' }}>정치</Link>
          <Link to="/economy" className="button" style={{ marginLeft: '10px' }}>경제</Link>
          <Link to="/society" className="button" style={{ marginLeft: '10px' }}>사회</Link>
          <Link to="/world" className="button" style={{ marginLeft: '10px' }}>세계</Link>
          <Link to="/culture" className="button" style={{ marginLeft: '10px' }}>문화</Link>
          <Link to="/entertainment" className="button" style={{ marginLeft: '10px' }}>연예</Link>
          <Link to="/sports" className="button" style={{ marginLeft: '10px' }}>스포츠</Link>
        </div>
      </div>
      <div className="header" style={{ textAlign: 'center' }}>
        <h1 className="title">KoWordRank 모델 키워드 결과 - {category}</h1>
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

export default WholePage;
