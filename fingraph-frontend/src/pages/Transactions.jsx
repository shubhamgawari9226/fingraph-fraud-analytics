import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";

function Transactions() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected transaction for details
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Backend loading/error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Transaction data
  const [transactions, setTransactions] = useState([]);

  // =========================================
  // LOAD TRANSACTIONS FROM BACKEND
  // =========================================

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTransactions(50);

        const backendTransactions =
          data.transactions || [];

        const formattedTransactions =
          backendTransactions.map((item) => {
            const riskIndex = Number(
              item.risk_index || 0
            );

            let risk = "Low";

            if (riskIndex >= 0.7) {
              risk = "High";
            } else if (riskIndex >= 0.4) {
              risk = "Medium";
            }

            let status = "Completed";

            const fraudLabel =
              String(
                item.fraud_label || ""
              ).toLowerCase();

            if (
              fraudLabel === "suspicious" ||
              fraudLabel === "fraud"
            ) {
              status = "Suspicious";
            }

            return {
              id:
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

              date: item.txn_datetime
                ? new Date(
                    item.txn_datetime
                  ).toLocaleString("en-IN")
                : "—",

              risk,

              status,

              channel:
                item.channel || "—",

              riskIndex,

              fraudLabel,
            };
          });

        setTransactions(
          formattedTransactions
        );
      } catch (err) {
        console.error(
          "Transactions API error:",
          err
        );

        setError(
          "Unable to load transactions from backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // =========================================
  // FILTER TRANSACTIONS
  // =========================================

  const filteredTransactions =
    transactions.filter((item) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        item.id
          .toLowerCase()
          .includes(searchText) ||
        item.customer
          .toLowerCase()
          .includes(searchText) ||
        item.amount
          .toLowerCase()
          .includes(searchText) ||
        item.channel
          .toLowerCase()
          .includes(searchText);

      const matchesRisk =
        riskFilter === "All" ||
        item.risk === riskFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesRisk &&
        matchesStatus
      );
    });

  // =========================================
  // STATISTICS
  // =========================================

  const highRiskCount =
    transactions.filter(
      (item) => item.risk === "High"
    ).length;

  const suspiciousCount =
    transactions.filter(
      (item) => item.status === "Suspicious"
    ).length;

  const blockedCount =
    transactions.filter(
      (item) => item.status === "Blocked"
    ).length;

  // =========================================
  // INVESTIGATE TRANSACTION
  // =========================================

  const handleInvestigate = (
    transactionId
  ) => {
    setTransactions(
      (currentTransactions) =>
        currentTransactions.map(
          (item) =>
            item.id === transactionId
              ? {
                  ...item,
                  status: "Review",
                }
              : item
        )
    );

    setSelectedTransaction(
      (currentTransaction) =>
        currentTransaction
          ? {
              ...currentTransaction,
              status: "Review",
            }
          : null
    );
  };

  // =========================================
  // VIEW DETAILS
  // =========================================

  const handleViewDetails = (
    transaction
  ) => {
    setSelectedTransaction(
      transaction
    );
  };

  // =========================================
  // CLOSE DETAILS
  // =========================================

  const closeDetails = () => {
    setSelectedTransaction(null);
  };

  // =========================================
  // RETURN UI
  // =========================================

  return (
    <div className="page-container">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <h2>Transactions</h2>

          <p>
            Monitor financial transactions,
            risk levels, and suspicious activity.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search transaction..."
          className="search-input"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =====================================
          API ERROR
      ====================================== */}

      {error && (
        <div className="api-error">
          ⚠️ {error}
        </div>
      )}

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="investigation-stats">

        <div className="info-card">
          <span>
            💳 Total Transactions
          </span>

          <h3>
            {loading
              ? "..."
              : transactions.length}
          </h3>

          <small>
            Transactions monitored
          </small>
        </div>

        <div className="info-card">
          <span>
            ⚠️ Suspicious
          </span>

          <h3>
            {loading
              ? "..."
              : suspiciousCount}
          </h3>

          <small>
            Require investigation
          </small>
        </div>

        <div className="info-card">
          <span>
            🔴 High Risk
          </span>

          <h3>
            {loading
              ? "..."
              : highRiskCount}
          </h3>

          <small>
            Priority transactions
          </small>
        </div>

        <div className="info-card">
          <span>
            🚫 Blocked
          </span>

          <h3>
            {loading
              ? "..."
              : blockedCount}
          </h3>

          <small>
            Blocked transactions
          </small>
        </div>

      </div>

      {/* =====================================
          TRANSACTION PANEL
      ====================================== */}

      <div className="investigation-panel transactions-panel">

        <div className="panel-header">

          <div>
            <h3>
              Transaction Records
            </h3>

            <small>
              Review and monitor transaction activity
            </small>
          </div>

          {/* =================================
              FILTERS
          ================================== */}

          <div className="transaction-filters">

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value
                )
              }
              className="transaction-filter"
            >
              <option value="All">
                All Risk
              </option>

              <option value="High">
                High Risk
              </option>

              <option value="Medium">
                Medium Risk
              </option>

              <option value="Low">
                Low Risk
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="transaction-filter"
            >
              <option value="All">
                All Status
              </option>

              <option value="Suspicious">
                Suspicious
              </option>

              <option value="Review">
                Review
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Blocked">
                Blocked
              </option>
            </select>

          </div>

        </div>

        {/* =====================================
            TABLE
        ====================================== */}

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    Loading transactions...
                  </td>
                </tr>

              ) : filteredTransactions.length >
                0 ? (

                filteredTransactions.map(
                  (item) => (

                    <tr key={item.id}>

                      {/* Transaction ID */}

                      <td>
                        <strong>
                          {item.id}
                        </strong>
                      </td>

                      {/* Customer / Account */}

                      <td>
                        {item.customer}
                      </td>

                      {/* Amount */}

                      <td>
                        {item.amount}
                      </td>

                      {/* Date */}

                      <td>
                        {item.date}
                      </td>

                      {/* Risk */}

                      <td>

                        <span
                          className={`risk-badge ${item.risk.toLowerCase()}`}
                        >
                          {item.risk}
                        </span>

                      </td>

                      {/* Status */}

                      <td>

                        <span
                          className={`transaction-status ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>

                      </td>

                      {/* Actions */}

                      <td>

                        <div className="transaction-actions">

                          <button
                            type="button"
                            className="transaction-view-btn"
                            onClick={() =>
                              handleViewDetails(
                                item
                              )
                            }
                          >
                            View
                          </button>

                          {item.status !==
                            "Completed" &&
                            item.status !==
                              "Blocked" && (

                              <button
                                type="button"
                                className="transaction-investigate-btn"
                                onClick={() =>
                                  handleInvestigate(
                                    item.id
                                  )
                                }
                              >
                                Investigate
                              </button>

                            )}

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="no-transactions"
                  >
                    🔍 No transactions found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================
          TRANSACTION DETAILS MODAL
      ====================================== */}

      {selectedTransaction && (

        <div
          className="transaction-modal-overlay"
          onClick={closeDetails}
        >

          <div
            className="transaction-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="transaction-modal-header">

              <div>
                <h3>
                  Transaction Details
                </h3>

                <small>
                  Complete transaction information
                </small>
              </div>

              <button
                type="button"
                className="transaction-modal-close"
                onClick={closeDetails}
              >
                ×
              </button>

            </div>

            {/* Transaction Icon */}

            <div className="transaction-detail-icon">
              💳
            </div>

            <h2 className="transaction-detail-id">
              {selectedTransaction.id}
            </h2>

            {/* Details */}

            <div className="transaction-detail-list">

              <div className="transaction-detail-row">
                <span>
                  Customer
                </span>

                <strong>
                  {selectedTransaction.customer}
                </strong>
              </div>

              <div className="transaction-detail-row">
                <span>
                  Amount
                </span>

                <strong>
                  {selectedTransaction.amount}
                </strong>
              </div>

              <div className="transaction-detail-row">
                <span>
                  Date
                </span>

                <strong>
                  {selectedTransaction.date}
                </strong>
              </div>

              <div className="transaction-detail-row">
                <span>
                  Risk Level
                </span>

                <span
                  className={`risk-badge ${selectedTransaction.risk.toLowerCase()}`}
                >
                  {selectedTransaction.risk}
                </span>
              </div>

              <div className="transaction-detail-row">
                <span>
                  Status
                </span>

                <span
                  className={`transaction-status ${selectedTransaction.status.toLowerCase()}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              {/* Backend Channel */}

              <div className="transaction-detail-row">
                <span>
                  Channel
                </span>

                <strong>
                  {selectedTransaction.channel}
                </strong>
              </div>

            </div>

            {/* Modal Actions */}

            <div className="transaction-modal-actions">

              {selectedTransaction.status !==
                "Completed" &&
                selectedTransaction.status !==
                  "Blocked" && (

                  <button
                    type="button"
                    className="transaction-investigate-btn"
                    onClick={() =>
                      handleInvestigate(
                        selectedTransaction.id
                      )
                    }
                  >
                    🔎 Investigate
                  </button>

                )}

              <button
                type="button"
                className="secondary-btn"
                onClick={closeDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Transactions;