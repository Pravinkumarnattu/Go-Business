import "./index.css";

const Footer = () => {
  return (
    <footer className="footer" aria-label="Footer">
      <h1 className="footer-head">Go Bussiness</h1>
      <nav className="footer-nav">
        <ul className="footer-lists">
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a href="#privacy">Privacy</a>
          </li>
          <li>
            <a href="#terms">Terms</a>
          </li>
        </ul>
      </nav>
      <p className="footer-copyright">© 2024 Go Business, Inc.</p>
    </footer>
  );
};

export default Footer;
