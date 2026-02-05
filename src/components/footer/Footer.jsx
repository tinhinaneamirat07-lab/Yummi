import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <h2>Nuvia</h2>
          <p>Your smart recipe manager.</p>
        </div>

        <div>
          <h4>Explore</h4>
          <a href="/">Home</a>
          <a href="#recipes">Recipes</a>
          <a href="/planner">Planner</a>
          <a href="#">Contact</a>
        </div>

        <div>
          <h4>Social</h4>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">Youtube</a>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 Yummi — All rights reserved.
      </div>
    </footer>
  );
}
