import { Link, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Investigations from "./pages/Investigations";
import FraudNetwork from "./pages/FraudNetwork";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import InvestigationDetails from "./pages/InvestigationDetails";
import Settings from "./pages/Setting";

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

          <Link to="/transactions">
            💳 Transactions
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

        {/* Dashboard */}

        {location.pathname === "/" && (
          <Dashboard />
        )}

        {/* Investigations */}

        {location.pathname === "/investigations" && (
          <Investigations />
        )}

        {/* Fraud Network */}

        {location.pathname === "/fraud-network" && (
          <FraudNetwork />
        )}

        {/* Alerts */}

        {location.pathname === "/alerts" && (
          <Alerts />
        )}

        {/* Analytics */}

        {location.pathname === "/analytics" && (
          <Analytics />
        )}

        {/* Transactions */}

        {location.pathname === "/transactions" && (
          <Transactions />
        )}

        {/* Investigation Details */}

        {location.pathname === "/investigation-details" && (
          <InvestigationDetails />
        )}

        {/* Settings */}

        {location.pathname === "/settings" && (
          <Settings />
        )}

        {/* 404 / Unknown Route */}

        {![
          "/",
          "/investigations",
          "/fraud-network",
          "/alerts",
          "/analytics",
          "/transactions",
          "/investigation-details",
          "/settings",
        ].includes(location.pathname) && (
          <div className="page-container">

            <div className="investigation-panel">

              <h2>
                Page Not Found
              </h2>

              <p>
                The page you are looking for does not exist.
              </p>

              <Link
                to="/"
                className="primary-btn"
              >
                Go to Dashboard
              </Link>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default App;