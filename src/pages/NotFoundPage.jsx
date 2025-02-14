import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import ReactLoading from 'react-loading';
export default function NotFoundPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="container">
      <div
        className="row d-flex justify-content-center align-items-center"
        style={{
          height: '80vh',
        }}
      >
        <div className="col-lg-6 col-md-8">
          <h2 className="display-4">迷路的參加者，此路不通</h2>
          <div className="d-flex align-items-center">
            <p className="fs-3">請您稍等，系統會正為您傳送至舞會入口</p>
            <ReactLoading
              type={'cubes'}
              color={'#000'}
              height={40}
              width={60}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
