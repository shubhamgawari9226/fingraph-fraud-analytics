import { Link, Routes, Route, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Investigations from "./pages/Investigations";
import FraudNetwork from "./pages/Fraudnetwork";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
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

          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            📊 Dashboard
          </Link>

          <Link to="/investigations" className={location.pathname === "/investigations" ? "active" : ""}>
            🔍 Investigations
          </Link>

          <Link to="/fraud-network" className={location.pathname === "/fraud-network" ? "active" : ""}>
            ⚛ Fraud Network
          </Link>

          <Link to="/alerts" className={location.pathname === "/alerts" ? "active" : ""}>
            🚨 Alerts
          </Link>

          <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>
            ▣ Analytics
          </Link>

          <Link to="/transactions" className={location.pathname === "/transactions" ? "active" : ""}>
            💳 Transactions
          </Link>

          <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>
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

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/investigations" element={<Investigations />} />
          <Route path="/fraud-network" element={<FraudNetwork />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

      </main>

    </div>
  );
}

export default App;