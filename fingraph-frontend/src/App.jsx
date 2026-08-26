import { Link, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Investigations from "./pages/Investigations";
import FraudNetwork from "./pages/FraudNetwork";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import InvestigationDetails from "./pages/InvestigationDetails";
import Settings from "./pages/Setting";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const fraudData = [
  { time: "09:00", fraud: 12 },
  { time: "10:00", fraud: 18 },
  { time: "11:00", fraud: 15 },
  { time: "12:00", fraud: 28 },
  { time: "13:00", fraud: 22 },
  { time: "14:00", fraud: 35 },
  { time: "15:00", fraud: 30 },
  { time: "16:00", fraud: 42 }
];

function App() {
  const location = useLocation();

  return (
    <div className="dashboard">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="sidebar">

        <h2 className="logo">
          FinGraph
        </h2>

        <nav>

          <Link to="/">
            📊 Dashboard
          </Link>

          <Link to="/investigations">
            🔍 Investigations
          </Link>

          <Link to="/fraud-network">
            ⚛ Fraud Network
          </Link>

          <Link to="/alerts">
            🚨 Alerts
          </Link>

          <Link to="/analytics">
            ▣ Analytics
          </Link>

          {/* DAY 7 - TRANSACTIONS */}
          <Link to="/transactions">
            💳 Transactions
          </Link>
          <Link to="/account-investigation">
          👤 Account Investigation
          </Link>
          <Link to="/investigation-details">
          🔍 Investigation Details
          </Link>
          <Link to="/settings">
            ⚙ Settings
          </Link>

        </nav>

        <div className="sidebar-footer">
          <span>Frontend & UI</span>
          <small>FinGraph Analytics</small>
        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="main-content">

        {location.pathname === "/" ? (

          <>
            {/* =========================
                DASHBOARD HEADER
            ========================== */}

            <header className="topbar">

              <div>
                <h1>
                  Fraud Analytics Dashboard
                </h1>

                <p>
                  Real-time financial fraud monitoring
                </p>
              </div>

              <button className="user-button">
                👤 Analyst
              </button>

            </header>

            {/* =========================
                DASHBOARD STATISTICS
            ========================== */}

            <section className="stats-grid">

              <div className="stat-card">
                <span>
                  🚨 Active Alerts
                </span>

                <h2>24</h2>

                <small>
                  +12% today
                </small>
              </div>

              <div className="stat-card">
                <span>
                  💳 Transactions
                </span>

                <h2>12,840</h2>

                <small>
                  +8.4% today
                </small>
              </div>

              <div className="stat-card">
                <span>
                  ⚠️ Fraud Detected
                </span>

                <h2>₹8.4L</h2>

                <small>
                  +5.2% today
                </small>
              </div>

              <div className="stat-card">
                <span>
                  🕸️ Suspicious Networks
                </span>

                <h2>37</h2>

                <small>
                  3 new networks
                </small>
              </div>

            </section>

            {/* =========================
                DASHBOARD SECTIONS
            ========================== */}

            <section className="dashboard-grid">

              {/* FRAUD ACTIVITY */}

              <div className="dashboard-card">

                <div className="card-header">

                  <div>
                    <h2>
                      Fraud Activity
                    </h2>

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

                    <div
                      className="bar"
                      style={{ height: "45%" }}
                    ></div>

                    <div
                      className="bar"
                      style={{ height: "65%" }}
                    ></div>

                    <div
                      className="bar"
                      style={{ height: "40%" }}
                    ></div>

                    <div
                      className="bar"
                      style={{ height: "80%" }}
                    ></div>

                    <div
                      className="bar"
                      style={{ height: "55%" }}
                    ></div>

                    <div
                      className="bar"
                      style={{ height: "90%" }}
                    ></div>

                    <div
                      className="bar"
                      style={{ height: "70%" }}
                    ></div>

                  </div>

                  <div className="chart-labels">

                    <span>
                      10 AM
                    </span>

                    <span>
                      11 AM
                    </span>

                    <span>
                      12 PM
                    </span>

                    <span>
                      1 PM
                    </span>

                    <span>
                      2 PM
                    </span>

                    <span>
                      3 PM
                    </span>

                    <span>
                      4 PM
                    </span>

                  </div>

                </div>

              </div>

              {/* RISK OVERVIEW */}

              <div className="dashboard-card">

                <div className="card-header">

                  <div>
                    <h2>
                      Risk Overview
                    </h2>

                    <p>
                      Current transaction risk levels
                    </p>
                  </div>

                </div>

                <div className="risk-list">

                  <div className="risk-item">
                    <span>
                      🔴 High Risk
                    </span>

                    <strong>
                      18%
                    </strong>
                  </div>

                  <div className="risk-item">
                    <span>
                      🟡 Medium Risk
                    </span>

                    <strong>
                      32%
                    </strong>
                  </div>

                  <div className="risk-item">
                    <span>
                      🟢 Low Risk
                    </span>

                    <strong>
                      50%
                    </strong>
                  </div>

                </div>

              </div>

            </section>
          </>

        ) : location.pathname === "/investigations" ? (

          <Investigations />

        ) : location.pathname === "/fraud-network" ? (

          <FraudNetwork />

        ) : location.pathname === "/alerts" ? (

          <Alerts />

        ) : location.pathname === "/analytics" ? (

          <Analytics />

        ) : location.pathname === "/transactions" ? (

          <Transactions />

        ) : location.pathname === "/settings" ? (

          <Settings />

        ) : location.pathname === "/investigation-details" ? (

          <InvestigationDetails />
          ) : location.pathname === "/settings" ? (
             <Settings />

        ) : (

          <Dashboard />

        )}

      </main>

    </div>
  );
}

export default App;