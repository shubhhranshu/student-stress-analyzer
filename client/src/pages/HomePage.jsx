import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-eyebrow">
          <span>🔬</span> K-Means Clustering • Machine Learning
        </div>
        <h1 className="hero-title">
          Understand Student<br />
          <span>Stress Patterns</span>
        </h1>
        <p className="hero-subtitle">
          Collect student wellbeing data, run unsupervised K-Means clustering, and 
          visualize which students are at risk — powered by real behavioral indicators.
        </p>
        <div className="hero-cta">
          <Link to="/add" className="btn btn-primary btn-lg">
            ✏️ Add Student Data
          </Link>
          <Link to="/analysis" className="btn btn-secondary btn-lg">
            📊 View Analysis
          </Link>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧮</div>
            <div className="feature-title">K-Means Clustering</div>
            <p className="feature-desc">
              Unsupervised machine learning groups students into Low, Moderate, and High
              stress clusters based on 7 behavioral features.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <div className="feature-title">Rich Visualizations</div>
            <p className="feature-desc">
              Scatter plots, radar charts, and bar charts bring your data to life with 
              color-coded cluster insights.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗂️</div>
            <div className="feature-title">JSON Data Store</div>
            <p className="feature-desc">
              Lightweight JSON file-based persistence — no database required. Every 
              student record is preserved instantly.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Real-time Re-clustering</div>
            <p className="feature-desc">
              Add or remove students and immediately see how the cluster boundaries shift
              across the entire dataset.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
