import {useNavigate} from "react-router-dom";
import "./index.css";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found-container">   
        <h1 className="not-found-heading">404</h1>
        <p className="not-found-subheading">Page Not Found</p>
        <button className="not-found-button" onClick={() => navigate("/")}>
            Back to Dashboard
        </button>
    </div>  
    );  
}

export default NotFound;