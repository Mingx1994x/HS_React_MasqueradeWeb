import { Link } from 'react-router';

const HomePage = () => {
  return (
    <>
      <div
        style={{
          height: '100vh',
        }}
      >
        <h2>這裡是首頁</h2>
        <h3>banner section</h3>
        <p>請先往下滑</p>
      </div>
      <hr />
      <div
        style={{
          height: '50vh',
        }}
      >
        <h3>區塊二</h3>
      </div>
      <hr />
      <div
        style={{
          height: '50vh',
        }}
      >
        <h3>區塊三</h3>
        <Link to="/aboutUs" className="btn btn-primary">
          前往關於我們
        </Link>
      </div>
    </>
  );
};

export default HomePage;
