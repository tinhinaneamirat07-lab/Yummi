import { Link } from "react-router-dom";
import "./CallToAction.css";

export default function CallToAction() {
  return (
    <section className="ritual">
      <div className="ritual-content">
        <span className="ritual-label">THE YUMMI RITUAL</span>

        <h2>
          Cooking is not a task.
          <br />
          <em>It’s a ritual.</em>
        </h2>

        <p>
          Plan your week with intention, save what you love,
          and turn everyday meals into meaningful moments.
        </p>

        <Link to="/planner" className="ritual-btn">
          Begin your ritual
        </Link>
      </div>
    </section>
  );
}
