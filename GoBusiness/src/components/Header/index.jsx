import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Header = () => {
  const navigate = useNavigate();
  const backtoLogin = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };
  return (
    <div className="header">
      <h1
        className="header-heading"
        aria-label="Primary"
        onClick={() => navigate("/")}
      >
        Go Business
      </h1>
      <div className="header-buttons">
        <button className="try-button" aria-label="Try for free">
          Try for free
        </button>
        <button
          className="logout-button"
          onClick={backtoLogin}
          aria-label="Go to dashboard home"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
