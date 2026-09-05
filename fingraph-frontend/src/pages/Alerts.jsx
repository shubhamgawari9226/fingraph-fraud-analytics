import { useEffect, useState } from "react";
import { getFraudAnalytics } from "../services/api";

function Alerts() {
  // =========================
  // ALERT STATE
  // =========================

  const [alerts, setAlerts] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD ALERTS FROM BACKEND
  // =========================

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getFraudAnalytics(50);

        const backendTransactions =
          response?.transactions || [];

        const formattedAlerts = backendTransactions
          .filter((item) => {
            const fraudLabel = String(
              item.fraud_label || ""
            ).toLowerCase();

            const riskIndex = Number(
              item.risk_index || 0
            );

            // Show suspicious/fraud/high-risk
            // transactions as alerts
            return (
              fraudLabel === "fraud" ||
              fraudLabel === "suspicious" ||
              riskIndex >= 0.7
            );
          })
          .map((item, index) => {
            const riskIndex = Number(
              item.risk_index || 0
            );

            // =========================
            // DETERMINE RISK
            // =========================

            let risk = "Medium";

            if (riskIndex >= 0.85) {
              risk = "Critical";
            } else if (riskIndex >= 0.7) {
              risk = "High";
            } else if (riskIndex >= 0.4) {
              risk = "Medium";
            } else {
              risk = "Low";
            }

            // =========================
            // FRAUD LABEL
            // =========================

            const fraudLabel = String(
              item.fraud_label || ""
            ).toLowerCase();

            // =========================
            // STATUS
            // =========================

            let status = "Active";

            if (fraudLabel === "fraud") {
              status = "Active";
            } else if (
              fraudLabel === "suspicious"
            ) {
              status = "Investigating";
            }

            // =========================
            // DESCRIPTION
            // =========================

            let description =
              "Suspicious transaction activity detected.";

            if (risk === "Critical") {
              description =
                "Critical high-risk transaction detected.";
            } else if (risk === "High") {
              description =
                "High-risk transaction requires investigation.";
            } else if (
              fraudLabel === "suspicious"
            ) {
              description =
                "Suspicious transaction pattern detected.";
            }

            return {
              id:
                item.alert_id ||
                `ALT-${1001 + index}`,

              transaction:
                item.txn_id ||
                "Unknown",

              customer:
                item.account_id ||
                "Unknown",

              amount:
                `${item.currency || "₹"}${Number(
                  item.amount || 0
                ).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}`,

              risk,

              status,

              description,

              riskIndex,

              fraudLabel,
            };
          });

        setAlerts(formattedAlerts);
      } catch (err) {
        console.error(
          "Alerts API error:",
          err
        );

        setError(
          "Unable to load fraud alerts from backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

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

  const filteredAlerts = alerts.filter(
    (alert) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        String(alert.id)
          .toLowerCase()
          .includes(searchText) ||
        String(alert.transaction)
          .toLowerCase()
          .includes(searchText) ||
        String(alert.customer)
          .toLowerCase()
          .includes(searchText) ||
        String(alert.risk)
          .toLowerCase()
          .includes(searchText) ||
        String(alert.status)
          .toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "All" ||
        alert.risk === filter ||
        alert.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  // =========================
  // STATISTICS
  // =========================

  const criticalCount =
    alerts.filter(
      (alert) =>
        alert.risk === "Critical"
    ).length;

  const highRiskCount =
    alerts.filter(
      (alert) =>
        alert.risk === "High"
    ).length;

  const mediumRiskCount =
    alerts.filter(
      (alert) =>
        alert.risk === "Medium"
    ).length;

  const resolvedCount =
    alerts.filter(
      (alert) =>
        alert.status === "Resolved"
    ).length;

  // =========================
  // RISK CLASS
  // =========================

  const getRiskClass = (risk) => {
    return String(risk)
      .toLowerCase();
  };

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    return String(status)
      .toLowerCase()
      .replace(" ", "-");
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
          API ERROR
      ========================== */}

      {error && (
        <div className="api-error">
          ⚠️ {error}
        </div>
      )}

      {/* =========================
          ALERT STATISTICS
      ========================== */}

      <div className="investigation-stats">

        <div className="info-card">

          <span>
            🚨 Critical Alerts
          </span>

          <h3>
            {loading
              ? "..."
              : criticalCount}
          </h3>

          <small>
            Immediate attention
          </small>

        </div>

        <div className="info-card">

          <span>
            ⚠️ High Risk
          </span>

          <h3>
            {loading
              ? "..."
              : highRiskCount}
          </h3>

          <small>
            Priority alerts
          </small>

        </div>

        <div className="info-card">

          <span>
            🟡 Medium Risk
          </span>

          <h3>
            {loading
              ? "..."
              : mediumRiskCount}
          </h3>

          <small>
            Requires review
          </small>

        </div>

        <div className="info-card">

          <span>
            ✅ Resolved
          </span>

          <h3>
            {loading
              ? "..."
              : resolvedCount}
          </h3>

          <small>
            Resolved alerts
          </small>

        </div>

      </div>

      {/* =========================
          ALERT PANEL
      ========================== */}

      <div className="investigation-panel alerts-panel">

        {/* PANEL HEADER */}

        <div className="panel-header">

          <div>

            <h3>
              Active Fraud Alerts
            </h3>

            <small>
              Suspicious activities detected by FinGraph
            </small>

          </div>

          {/* FILTER */}

          <select
            className="alert-filter"
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
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

                <th>
                  Alert ID
                </th>

                <th>
                  Transaction
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Risk
                </th>

                <th>
                  Status
                </th>

                <th>
                  Description
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "20px",
                    }}
                  >
                    Loading fraud alerts...

                  </td>

                </tr>

              ) : filteredAlerts.length >
                0 ? (

                filteredAlerts.map(
                  (alert) => (

                    <tr
                      key={alert.id}
                    >

                      {/* ALERT ID */}

                      <td>

                        <strong>
                          {alert.id}
                        </strong>

                      </td>

                      {/* TRANSACTION */}

                      <td>
                        {alert.transaction}
                      </td>

                      {/* CUSTOMER */}

                      <td>
                        {alert.customer}
                      </td>

                      {/* AMOUNT */}

                      <td>
                        {alert.amount}
                      </td>

                      {/* RISK */}

                      <td>

                        <span
                          className={`risk-badge ${getRiskClass(
                            alert.risk
                          )}`}
                        >
                          {alert.risk}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`alert-status ${getStatusClass(
                            alert.status
                          )}`}
                        >
                          {alert.status}
                        </span>

                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <span className="alert-description">
                          {alert.description}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        {alert.status !==
                        "Resolved" ? (

                          <button
                            type="button"
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

                  )
                )

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