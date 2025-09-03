import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing">
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">
            Ordenar mi desorden
          </h1>
          
          <button 
            className="cta-button"
            onClick={goToDashboard}
          >
            Empezar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;