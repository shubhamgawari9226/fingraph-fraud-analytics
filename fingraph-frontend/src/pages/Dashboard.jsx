import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fraudData = [
    { time: "10 AM", value: 45 },
    { time: "11 AM", value: 65 },
    { time: "12 PM", value: 40 },
    { time: "1 PM", value: 80 },
    { time: "2 PM", value: 55 },
    { time: "3 PM", value: 90 },
    { time: "4 PM", value: 70 },
  ];

  const recentTransactions = [
    {
      id: "TXN-78421",
      customer: "Customer A",
      amount: "₹2.4L",
      risk: "High",
      status: "Suspicious",
    },
    {
      id: "TXN-78435",
      customer: "Customer B",
      amount: "₹85K",
      risk: "Medium",
      status: "Review",
    },
    {
      id: "TXN-78456",
      customer: "Customer C",
      amount: "₹42K",
      risk: "Low",
      status: "Completed",
    },
    {
      id: "TXN-78472",
      customer: "Customer D",
      amount: "₹1.8L",
      risk: "High",
      status: "Suspicious",
    },
  ];

  const recentAlerts = [
    {
      id: "ALT-1001",
      transaction: "TXN-78421",
      customer: "Customer A",
      risk: "Critical",
      status: "Active",
    },
    {
      id: "ALT-1002",
      transaction: "TXN-78472",
      customer: "Customer D",
      risk: "High",
      status: "Active",
    },
    {
      id: "ALT-1003",
      transaction: "TXN-78435",
      customer: "Customer B",
      risk: "Medium",
      status: "Review",
    },
  ];

  // =========================================
  // LOAD BACKEND STATISTICS
  // =========================================

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getStats();

        setStats(data);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError("Unable to connect to backend.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="topbar">
        <div>
          <h1>Fraud Analytics Dashboard</h1>
          <p>Real-time financial fraud monitoring</p>
        </div>

        <button className="user-button">
          👤 Analyst
        </button>
      </header>

      {/* =========================================
          API ERROR
      ========================================= */}

      {error && (
        <div className="api-error">
          ⚠️ {error}
        </div>
      )}

      {/* =========================================
          STATISTICS
      ========================================= */}

      <section className="stats-grid">

        <div className="stat-card">
          <span>🚨 Active Alerts</span>

          <h2>24</h2>

          <small>+12% today</small>
        </div>

        <div className="stat-card">
          <span>💳 Transactions</span>

          <h2>
            {loading
              ? "..."
              : stats
              ? Number(
                  stats.total_transactions
                ).toLocaleString()
              : "—"}
          </h2>

          <small>
            Total transactions
          </small>
        </div>

        <div className="stat-card">
          <span>⚠️ Fraud Detected</span>

          <h2>
            {loading
              ? "..."
              : stats
              ? Number(
                  stats.fraud_transactions
                ).toLocaleString()
              : "—"}
          </h2>

          <small>
            Fraud transactions
          </small>
        </div>

        <div className="stat-card">
          <span>🔴 High-Risk Transactions</span>

          <h2>
            {loading
              ? "..."
              : stats
              ? Number(
                  stats.high_risk_transactions
                ).toLocaleString()
              : "—"}
          </h2>

          <small>
            Priority transactions
          </small>
        </div>

      </section>

      {/* =========================================
          QUICK ACTIONS
      ========================================= */}

      <section className="dashboard-quick-actions">

        <Link
          to="/transactions"
          className="dashboard-action-card"
        >
          <span className="dashboard-action-icon">
            💳
          </span>

          <div>
            <h3>Transactions</h3>
            <p>Monitor financial activity</p>
          </div>

          <span className="dashboard-action-arrow">
            →
          </span>
        </Link>

        <Link
          to="/investigations"
          className="dashboard-action-card"
        >
          <span className="dashboard-action-icon">
            🔍
          </span>

          <div>
            <h3>Investigations</h3>
            <p>Review suspicious cases</p>
          </div>

          <span className="dashboard-action-arrow">
            →
          </span>
        </Link>

        <Link
          to="/alerts"
          className="dashboard-action-card"
        >
          <span className="dashboard-action-icon">
            🚨
          </span>

          <div>
            <h3>Fraud Alerts</h3>
            <p>Check active alerts</p>
          </div>

          <span className="dashboard-action-arrow">
            →
          </span>
        </Link>

        <Link
          to="/fraud-network"
          className="dashboard-action-card"
        >
          <span className="dashboard-action-icon">
            🕸️
          </span>

          <div>
            <h3>Fraud Network</h3>
            <p>Explore suspicious connections</p>
          </div>

          <span className="dashboard-action-arrow">
            →
          </span>
        </Link>

      </section>

      {/* =========================================
          MAIN DASHBOARD
      ========================================= */}

      <section className="dashboard-grid">

        {/* =====================================
            FRAUD ACTIVITY
        ====================================== */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Fraud Activity</h2>

              <p>
                Real-time fraud detection trends
              </p>
            </div>

            <span className="live-status">
              ● Live
            </span>

          </div>

          <div className="activity-chart">

            <div className="chart-bars">

              {fraudData.map((item, index) => (

                <div
                  className="bar-wrapper"
                  key={index}
                >

                  <div
                    className="bar"
                    style={{
                      height: `${item.value}%`,
                    }}
                    title={`${item.time}: ${item.value}%`}
                  ></div>

                </div>

              ))}

            </div>

            <div className="chart-labels">

              {fraudData.map((item, index) => (

                <span key={index}>
                  {item.time}
                </span>

              ))}

            </div>

          </div>

        </div>

        {/* =====================================
            RISK OVERVIEW
        ====================================== */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Risk Overview</h2>

              <p>
                Current transaction risk levels
              </p>
            </div>

          </div>

          <div className="risk-list">

            <div className="risk-item">
              <span>🔴 High Risk</span>
              <strong>18%</strong>
            </div>

            <div className="risk-item">
              <span>🟡 Medium Risk</span>
              <strong>32%</strong>
            </div>

            <div className="risk-item">
              <span>🟢 Low Risk</span>
              <strong>50%</strong>
            </div>

          </div>

          <div className="dashboard-risk-progress">

            <div
              className="risk-progress-high"
              style={{ width: "18%" }}
            ></div>

            <div
              className="risk-progress-medium"
              style={{ width: "32%" }}
            ></div>

            <div
              className="risk-progress-low"
              style={{ width: "50%" }}
            ></div>

          </div>

        </div>

      </section>

      {/* =========================================
          RECENT TRANSACTIONS
      ========================================= */}

      <section className="dashboard-card dashboard-table-card">

        <div className="card-header">

          <div>
            <h2>Recent Transactions</h2>

            <p>
              Latest financial transaction activity
            </p>
          </div>

          <Link
            to="/transactions"
            className="dashboard-view-all"
          >
            View All →
          </Link>

        </div>

        <div className="dashboard-table-container">

          <table className="dashboard-table">

            <thead>

              <tr>
                <th>Transaction</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {recentTransactions.map((item) => (

                <tr key={item.id}>

                  <td>
                    <strong>{item.id}</strong>
                  </td>

                  <td>
                    {item.customer}
                  </td>

                  <td>
                    {item.amount}
                  </td>

                  <td>
                    <span
                      className={`risk-badge ${item.risk.toLowerCase()}`}
                    >
                      {item.risk}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`transaction-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* =========================================
          RECENT FRAUD ALERTS
      ========================================= */}

      <section className="dashboard-card dashboard-table-card">

        <div className="card-header">

          <div>
            <h2>Recent Fraud Alerts</h2>

            <p>
              Latest suspicious activities detected
            </p>
          </div>

          <Link
            to="/alerts"
            className="dashboard-view-all"
          >
            View All →
          </Link>

        </div>

        <div className="dashboard-table-container">

          <table className="dashboard-table">

            <thead>

              <tr>
                <th>Alert ID</th>
                <th>Transaction</th>
                <th>Customer</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {recentAlerts.map((alert) => (

                <tr key={alert.id}>

                  <td>
                    <strong>{alert.id}</strong>
                  </td>

                  <td>
                    {alert.transaction}
                  </td>

                  <td>
                    {alert.customer}
                  </td>

                  <td>

                    <span
                      className={`risk-badge ${
                        alert.risk === "Critical"
                          ? "high"
                          : alert.risk.toLowerCase()
                      }`}
                    >
                      {alert.risk}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`transaction-status ${
                        alert.status.toLowerCase()
                      }`}
                    >
                      {alert.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;