import { useEffect, useState } from "react";

function Alerts() {
  const defaultAlerts = [
    {
      id: "ALT-1001",
      transaction: "TXN-78421",
      customer: "Customer A",
      amount: "₹2.4L",
      risk: "Critical",
      status: "Active",
      description: "Unusual high-value transaction detected.",
    },
    {
      id: "ALT-1002",
      transaction: "TXN-78435",
      customer: "Customer B",
      amount: "₹85K",
      risk: "High",
      status: "Investigating",
      description: "Multiple transactions detected from unusual location.",
    },
    {
      id: "ALT-1003",
      transaction: "TXN-78456",
      customer: "Customer C",
      amount: "₹42K",
      risk: "Medium",
      status: "Active",
      description: "Transaction pattern differs from normal activity.",
    },
    {
      id: "ALT-1004",
      transaction: "TXN-78478",
      customer: "Customer D",
      amount: "₹1.2L",
      risk: "High",
      status: "Resolved",
      description: "Suspicious account activity was reviewed.",
    },
  ];

  // =========================
  // ALERT STATE
  // =========================

  const [alerts, setAlerts] = useState(() => {
    try {
      const savedAlerts = localStorage.getItem("fraudAlerts");

      return savedAlerts
        ? JSON.parse(savedAlerts)
        : defaultAlerts;
    } catch (error) {
      return defaultAlerts;
    }
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // =========================
  // SAVE ALERTS
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "fraudAlerts",
      JSON.stringify(alerts)
    );
  }, [alerts]);

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = (id, newStatus) => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              status: newStatus,
            }
          : alert
      )
    );
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredAlerts = alerts.filter((alert) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      alert.id.toLowerCase().includes(searchText) ||
      alert.transaction.toLowerCase().includes(searchText) ||
      alert.customer.toLowerCase().includes(searchText) ||
      alert.risk.toLowerCase().includes(searchText) ||
      alert.status.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" ||
      alert.risk === filter ||
      alert.status === filter;

    return matchesSearch && matchesFilter;
  });

  // =========================
  // STATISTICS
  // =========================

  const criticalCount = alerts.filter(
    (alert) => alert.risk === "Critical"
  ).length;

  const highRiskCount = alerts.filter(
    (alert) => alert.risk === "High"
  ).length;

  const mediumRiskCount = alerts.filter(
    (alert) => alert.risk === "Medium"
  ).length;

  const resolvedCount = alerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  // =========================
  // RISK CLASS
  // =========================

  const getRiskClass = (risk) => {
    return risk.toLowerCase();
  };

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(" ", "-");
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="page-container">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="page-header">

        <div>
          <h2>Fraud Alerts</h2>

          <p>
            Monitor active and suspicious fraud alerts.
          </p>
        </div>

        <div className="alert-search">
          <input
            type="text"
            placeholder="Search alerts..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      </div>

      {/* =========================
          ALERT STATISTICS
      ========================== */}

      <div className="investigation-stats">

        <div className="info-card">
          <span>🚨 Critical Alerts</span>
          <h3>{criticalCount}</h3>
          <small>Immediate attention</small>
        </div>

        <div className="info-card">
          <span>⚠️ High Risk</span>
          <h3>{highRiskCount}</h3>
          <small>Priority alerts</small>
        </div>

        <div className="info-card">
          <span>🟡 Medium Risk</span>
          <h3>{mediumRiskCount}</h3>
          <small>Requires review</small>
        </div>

        <div className="info-card">
          <span>✅ Resolved</span>
          <h3>{resolvedCount}</h3>
          <small>Resolved alerts</small>
        </div>

      </div>

      {/* =========================
          ALERT PANEL
      ========================== */}

      <div className="investigation-panel alerts-panel">

        {/* PANEL HEADER */}

        <div className="panel-header">

          <div>
            <h3>Active Fraud Alerts</h3>

            <small>
              Suspicious activities detected by FinGraph
            </small>
          </div>

          {/* FILTER */}

          <select
            className="alert-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All Alerts
            </option>

            <option value="Critical">
              Critical
            </option>

            <option value="High">
              High Risk
            </option>

            <option value="Medium">
              Medium Risk
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Investigating">
              Investigating
            </option>

            <option value="Resolved">
              Resolved
            </option>
          </select>

        </div>

        {/* =========================
            ALERT TABLE
        ========================== */}

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Transaction</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredAlerts.length > 0 ? (

                filteredAlerts.map((alert) => (

                  <tr key={alert.id}>

                    <td>
                      <strong>
                        {alert.id}
                      </strong>
                    </td>

                    <td>
                      {alert.transaction}
                    </td>

                    <td>
                      {alert.customer}
                    </td>

                    <td>
                      {alert.amount}
                    </td>

                    <td>
                      <span
                        className={`risk-badge ${getRiskClass(
                          alert.risk
                        )}`}
                      >
                        {alert.risk}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`alert-status ${getStatusClass(
                          alert.status
                        )}`}
                      >
                        {alert.status}
                      </span>
                    </td>

                    <td>
                      <span className="alert-description">
                        {alert.description}
                      </span>
                    </td>

                    <td>

                      {alert.status !== "Resolved" ? (

                        <button
                          className="secondary-btn alert-action-btn"
                          onClick={() =>
                            updateStatus(
                              alert.id,
                              alert.status ===
                                "Active"
                                ? "Investigating"
                                : "Resolved"
                            )
                          }
                        >
                          {alert.status ===
                          "Active"
                            ? "Investigate"
                            : "Resolve"}
                        </button>

                      ) : (

                        <span className="resolved-label">
                          ✓ Completed
                        </span>

                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="no-alerts"
                  >
                    <div>
                      <span>
                        🔍
                      </span>

                      <h3>
                        No alerts found
                      </h3>

                      <p>
                        Try changing your search
                        or filter.
                      </p>
                    </div>
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Alerts;
