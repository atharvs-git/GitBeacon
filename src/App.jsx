import HealthScore from "./components/HealthScore";
import LearningVelocity from "./components/LearningVelocity";
import DeveloperComparison from "./components/DeveloperComparison";
import LanguageAnalysis from "./components/LanguageAnalysis";
import { useState } from "react";

import "./App.css";


function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [activeExploreCard, setActiveExploreCard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const exploreFeatures = [
    {
      id: "health-score",
      title: "Developer Health Score",
      description: "Comprehensive analysis of your GitHub profile health",
      details: "Evaluates your repository maintenance, contribution consistency, and code quality indicators to provide an overall health score."
    },
    {
      id: "learning-diversity",
      title: "Learning Velocity & Repository Diversity",
      description: "Track growth and tech stack breadth",
      details: "Measures how quickly you're learning new languages and frameworks while analyzing the variety of programming languages and technologies across your repositories to show your technical diversity and learning trajectory."
    },
    {
      id: "developer-comparison",
      title: "Developer Comparison",
      description: "Compare yourself with other developers",
      details: "Compare your profile metrics with other developers to understand relative strengths and areas for growth."
    },
    {
      id: "language-contributions",
      title: "Language Analysis & Contribution Insights",
      description: "Languages and contribution patterns combined",
      details: "Shows your proficiency across programming languages and their usage frequency alongside your contribution patterns, commit frequency, and impact across all your repositories and collaborations."
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    const username = searchInputValue.trim();
    
    if (!username) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      
      if (data.message === "Not Found") {
        setError(`User "${username}" not found on GitHub`);
        setSearchResults(null);
      } else {
        setSearchResults(data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data. Please try again.");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchInputValue("");
    setActiveExploreCard(null);
    setError(null);
  };

  const toggleExploreCard = (cardId) => {
    setActiveExploreCard(activeExploreCard === cardId ? null : cardId);
  };

  return (
    <div className="app-container">
      {/* Header - Always Visible */}
      <header className="header">
        <div className="header-content">
          <div className="logo">GitBeacon</div>
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="SEARCH PROFILE HERE"
              className="search-bar"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="search-btn"
              title="Search"
            >
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
          <div className="header-icons">
            <button
              className="icon-btn"
              title="GitHub"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Dynamic */}
      <main className="main-content">
        {searchResults ? (
          // Search Results View
          <div className="search-results-view">
            <div className="search-results-header">
              <button className="back-btn" onClick={clearSearch}>
                ← Back to Explore
              </button>
              <h1>GitHub Profile Analysis Report</h1>
            </div>

            {/* GitHub User Profile Card */}
            <section className="profile-section">
              <div className="profile-card">
                {searchResults.avatar_url && (
                  <img
                    src={searchResults.avatar_url}
                    alt={searchResults.login}
                    className="profile-avatar"
                  />
                )}
                <div className="profile-info">
                  <h2>{searchResults.name || searchResults.login}</h2>
                  <p className="profile-login">@{searchResults.login}</p>
                  {searchResults.bio && (
                    <p className="profile-bio">{searchResults.bio}</p>
                  )}
                  <div className="profile-stats">
                    <div className="stat">
                      <span className="stat-label">Public Repos</span>
                      <span className="stat-value">{searchResults.public_repos}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Followers</span>
                      <span className="stat-value">{searchResults.followers}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Following</span>
                      <span className="stat-value">{searchResults.following}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Joined</span>
                      <span className="stat-value">
                        {new Date(searchResults.created_at).toLocaleDateString("en-US", {month: "short", year: "numeric"})}
                      </span>
                    </div>
                    
                  
                  </div>
                  {searchResults.location && (
                    <p className="profile-detail">
                      <strong>Location:</strong> {searchResults.location}
                    </p>
                  )}
                  {searchResults.company && (
                    <p className="profile-detail">
                      <strong>Company:</strong> {searchResults.company}
                    </p>
                  )}
                  {searchResults.blog && (
                    <p className="profile-detail">
                      <strong>Website:</strong>{" "}
                      <a href={searchResults.blog} target="_blank" rel="noopener noreferrer">
                        {searchResults.blog}
                      </a>
                    </p>
                  )}
                  <a
                    href={searchResults.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link-btn"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>

              {/* Explore Features with Active Card Content */}
              <div className="explore-section">
                <h3 className="explore-title">Explore Features</h3>
                <div className="explore-grid">
                  {exploreFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className={`explore-card ${
                        activeExploreCard === feature.id ? "active" : ""
                      }`}
                      onClick={() => toggleExploreCard(feature.id)}
                    >
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                      
                    </div>
                  ))}
                </div>

                {/* Explore Content Panel - Shows when a card is active */}
                {activeExploreCard && (
                  <div className="explore-content-panel">
                    <div className="panel-content">
                      <h3>
                        {exploreFeatures.find((f) => f.id === activeExploreCard)?.title}
                      </h3>
                      {activeExploreCard === "health-score" ? (
                        <HealthScore
                        username={searchResults.login}
                        />
                      ) : activeExploreCard ===
                      "learning-diversity" ? (
                      <LearningVelocity
                      username={searchResults.login}
                      />
                      ) : activeExploreCard ===
                      "developer-comparison" ? (
                        <DeveloperComparison
                        username={searchResults.login}
                        />
                      ) : activeExploreCard ===
                      "language-contributions" ? (
                        <LanguageAnalysis
                        username={searchResults.login}
                        />

                      ) : (
                      <p>
                        {exploreFeatures.find(
                          (f) =>
                            f.id ===
                          activeExploreCard
                          )?.details}
                      </p>
                      )}
                     
                      <div className="panel-actions">
                        <button
                          className="close-panel-btn"
                          onClick={() => setActiveExploreCard(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          // Landing/Discover View
          <div className="landing-view">
            <section className="features">
              <h2 className="features-title">WHAT YOU'LL DISCOVER</h2>
              <div className="features-grid">
                <div className="feature-card">
                  
                  <p>
                    <strong>#1 . Provides Analysis of your GitHub Profile</strong> and Lets
                    you know the Health Score
                  </p>
                </div>
                <div className="feature-card">
                  <p>
                    <strong>
                      #2 . Know your Code Personality & Explore more knowing your Learning
                      Velocity and Repository Diversity Score
                    </strong>
                  </p>
                </div>
                <div className="feature-card">
                  <p>
                    <strong>
                      #3 . Compare your profile or any other two Developers
                    </strong>{" "}
                    to get insights of how different both are
                  </p>
                </div>
              </div>
            </section>

            {/* Explore Features Section in Landing */}
            <section className="explore-section explore-landing">
              <h3 className="explore-title">Interactive Analysis Features</h3>
              <div className="explore-grid">
                {exploreFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className={`explore-card ${
                      activeExploreCard === feature.id ? "active" : ""
                    }`}
                    onClick={() => toggleExploreCard(feature.id)}
                  >
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                    
                  </div>
                ))}
              </div>

              {/* Explore Content Panel in Landing */}
              {activeExploreCard && (
                <div className="explore-content-panel">
                  <div className="panel-content">
                    <h3>
                      {exploreFeatures.find((f) => f.id === activeExploreCard)?.title}
                    </h3>
                    <p>
                      {exploreFeatures.find((f) => f.id === activeExploreCard)?.details}
                    </p>
                    <div className="panel-actions">
                      <button
                      className="close-panel-btn"
                      onClick={() => setActiveExploreCard(null)}
                      >
                        Close
                        </button>
                    </div>
                  </div>
                </div>
                
              )}
            </section>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="error-close-btn">
              ✕
            </button>
          </div>
        )}
      </main>

      {/* Contact Section - Always Visible */}
      <section className="contact">
        <div className="contact-content">
          <h3 className="contact-title">
            <span className="contact-icon">✉</span>
            Contact
          </h3>
          <p className="contact-text">
            Questions? Feedback? We'd love to hear from you! Whether you have
            suggestions for improvement or need help with your GitHub profile.
          </p>
          <a href="mailto:atharvgupta.code@gmail.com" className="contact-email">
            atharvgupta.code@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}

export default App;
