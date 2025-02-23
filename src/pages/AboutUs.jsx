import { Link } from 'react-router';

const AboutUs = () => {
  return (
    <>
      <div
        style={{
          height: '100vh',
        }}
      >
        <h2>這裡是關於我們頁面</h2>
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
        <Link to="/" className="btn btn-warning">
          返回首頁
        </Link>
      </div>
    </>
  );
};

export default AboutUs;
