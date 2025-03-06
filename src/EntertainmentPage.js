import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import './App.css';

function EntertainmentPage() {
  const category = "연예";
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
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `KoWordRank 모델 키워드 결과 - ${category}`, // ★ 수정됨
        color: 'white',
        font: { size: 18 }
      },
      legend: { labels: { color: 'white' } }
    },
    scales: {
      x: { title: { display: true, text: '점수', color: 'white' }, ticks: { color: 'white' } },
      y: { title: { display: true, text: '키워드', color: 'white' }, ticks: { color: 'white', autoSkip: true, maxTicksLimit: 20 } }
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const link = kowordrankData[index].link;
        if (link) window.open(link, '_blank');
        else alert("해당 키워드와 관련된 기사를 찾을 수 없습니다.");
      }
    }
  };

  return (
    <div className="container">
      <div className="navbar">
        <div className="nav-title">실시간 뉴스 키워드</div>
        <div className="nav-links">
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
          <p>Loading... (약 40초 소요)</p>
          <p>경과 시간: {elapsedTime}초</p>
        </div>
      ) : (
        <div style={{ margin: '20px auto', maxWidth: '900px' }}>
          <div style={{ width: '1000px', height: '600px', margin: '0 auto' }}>
            <Bar data={barData} options={barOptions} />
          </div>
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

export default EntertainmentPage;
