import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <h1 className="logo">AI-EV Platform</h1>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to AI-EV Platform</h2>
          <p>Intelligent Electric Vehicle Solutions Powered by AI</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h3>Features</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <h4>Smart Analytics</h4>
            <p>Advanced AI-powered analytics for vehicle performance</p>
          </div>
          <div className="feature-card">
            <h4>Real-time Monitoring</h4>
            <p>Track your EV in real-time with our platform</p>
          </div>
          <div className="feature-card">
            <h4>Eco-Friendly</h4>
            <p>Optimize your electric vehicle for sustainability</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h3>About Us</h3>
        <p>We are dedicated to revolutionizing electric vehicle management through artificial intelligence.</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 AI-EV Platform. All rights reserved.</p>
        <div id="contact" className="contact-info">
          <p>Email: info@aievplatform.com</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;