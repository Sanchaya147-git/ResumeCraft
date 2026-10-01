import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="page home-page">
      <div className="page-container home-container">

        <section className="home-hero">
          <div className="hero-badge">
            ✦ AI-Powered Resume Builder
          </div>

          <h1>
            Build a Resume
            <br />
            That <span>Gets Noticed.</span>
          </h1>

          <p>
            Create a professional, modern and ATS-friendly resume
            in minutes with our simple resume builder.
          </p>

          <div className="hero-buttons">
            <Link to="/builder" className="primary-button">
              Start Building <span>→</span>
            </Link>

            <Link to="/templates" className="secondary-button">
              Explore Templates
            </Link>
          </div>

          <div className="home-highlights">
            <div>
              <strong>⚡</strong>
              <span>Quick & Easy</span>
            </div>

            <div>
              <strong>✦</strong>
              <span>Modern Templates</span>
            </div>

            <div>
              <strong>✓</strong>
              <span>ATS Friendly</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

export default Home;