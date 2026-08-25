import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [fraudSummary, setFraudSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, fraudRes] = await Promise.all([
          fetch(`${API_URL}/stats`),
          fetch(`${API_URL}/fraud-summary`)
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }

        if (fraudRes.ok) {
          setFraudSummary(await fraudRes.json());
        }

      } catch (err) {
        setError("Could not connect to API. Is the backend running?");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const fraudData = [
    { time: "10 AM", value: 45 },
    { time: "11 AM", value: 65 },
    { time: "12 PM", value: 40 },
    { time: "1 PM", value: 80 },
    { time: "2 PM", value: 55 },
    { time: "3 PM", value: 90 },
    { time: "4 PM", value: 70 },
  ];

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="topbar">
        <div>
          <h1>Fraud Analytics Dashboard</h1>
          <p>Real-time financial fraud monitoring</p>
        </div>

        <button className="user-button">
          👤 Analyst
        </button>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="error-banner" style={{
          background: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "8px",
          padding: "12px 16px",
          margin: "0 0 16px 0",
          color: "#ef4444",
          fontSize: "14px"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Statistics - now from live API */}
      <section className="stats-grid">

        <div className="stat-card">
          <span>💳 Total Accounts</span>
          <h2>{loading ? "..." : (stats?.total_accounts?.toLocaleString() ?? "—")}</h2>
          <small>From Neo4j graph</small>
        </div>

        <div className="stat-card">
          <span>📊 Transactions</span>
          <h2>{loading ? "..." : (stats?.total_transactions?.toLocaleString() ?? "—")}</h2>
          <small>Total processed</small>
        </div>

        <div className="stat-card">
          <span>⚠️ Suspicious</span>
          <h2>{loading ? "..." : (stats?.fraud_transactions?.toLocaleString() ?? "—")}</h2>
          <small>
            {fraudSummary
              ? `${fraudSummary.fraud_percentage}% of total`
              : "Calculating..."
            }
          </small>
        </div>

        <div className="stat-card">
          <span>🔴 High Risk</span>
          <h2>{loading ? "..." : (stats?.high_risk_transactions?.toLocaleString() ?? "—")}</h2>
          <small>
            {fraudSummary
              ? `${fraudSummary.high_risk_percentage}% of total`
              : "Calculating..."
            }
          </small>
        </div>

      </section>

      {/* Dashboard Sections */}
      <section className="dashboard-grid">

        {/* Fraud Activity */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Fraud Activity</h2>
              <p>Real-time fraud detection trends</p>
            </div>

            <span className="live-status">
              ● Live
            </span>
          </div>

          <div className="activity-chart">

            <div className="chart-bars">
              {fraudData.map((item, index) => (
                <div className="bar-wrapper" key={index}>
                  <div
                    className="bar"
                    style={{ height: `${item.value}%` }}
                    title={`${item.time}: ${item.value}%`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="chart-labels">
              {fraudData.map((item, index) => (
                <span key={index}>{item.time}</span>
              ))}
            </div>

          </div>
        </div>

        {/* Risk Overview */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Risk Overview</h2>
              <p>Current transaction risk levels</p>
            </div>
          </div>

          <div className="risk-list">

            <div className="risk-item">
              <span>🔴 High Risk</span>
              <strong>
                {fraudSummary ? `${fraudSummary.high_risk_percentage}%` : "—"}
              </strong>
            </div>

            <div className="risk-item">
              <span>🟡 Suspicious</span>
              <strong>
                {fraudSummary ? `${fraudSummary.fraud_percentage}%` : "—"}
              </strong>
            </div>

            <div className="risk-item">
              <span>🟢 Normal</span>
              <strong>
                {fraudSummary
                  ? `${(100 - fraudSummary.fraud_percentage).toFixed(2)}%`
                  : "—"
                }
              </strong>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;