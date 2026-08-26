import { useState, useEffect } from "react";

function Investigations() {
  // =========================
  // SHOW / HIDE FORM
  // =========================
  const [showForm, setShowForm] = useState(false);

  // =========================
  // SELECTED CASE
  // =========================
  const [selectedCase, setSelectedCase] = useState(null);

  // =========================
  // SEARCH & FILTERS
  // =========================
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // NEW INVESTIGATION FORM
  // =========================
  const [newCase, setNewCase] = useState({
    transaction: "",
    customer: "",
    amount: "",
    risk: "Medium",
    status: "Open",
  });

  // =========================
  // DEFAULT INVESTIGATIONS
  // =========================
  const defaultCases = [
    {
      id: "INV-1001",
      transaction: "TXN-78421",
      customer: "Customer A",
      amount: "₹2.4L",
      risk: "High",
      status: "Open",
    },
    {
      id: "INV-1002",
      transaction: "TXN-78435",
      customer: "Customer B",
      amount: "₹85K",
      risk: "Medium",
      status: "Investigating",
    },
    {
      id: "INV-1003",
      transaction: "TXN-78456",
      customer: "Customer C",
      amount: "₹42K",
      risk: "Low",
      status: "Review",
    },
  ];

  // =========================
  // LOAD CASES
  // =========================
  const [cases, setCases] = useState(() => {
    try {
      const savedCases =
        localStorage.getItem("investigations");

      if (savedCases) {
        return JSON.parse(savedCases);
      }

      return defaultCases;
    } catch (error) {
      console.error(
        "Error loading investigations:",
        error
      );

      return defaultCases;
    }
  });

  // =========================
  // SAVE CASES
  // =========================
  useEffect(() => {
    try {
      localStorage.setItem(
        "investigations",
        JSON.stringify(cases)
      );
    } catch (error) {
      console.error(
        "Error saving investigations:",
        error
      );
    }
  }, [cases]);

  // =========================
  // CREATE INVESTIGATION
  // =========================
  const handleAddInvestigation = (e) => {
    e.preventDefault();

    if (
      !newCase.transaction.trim() ||
      !newCase.customer.trim() ||
      !newCase.amount.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newId =
      cases.length > 0
        ? `INV-${1001 + cases.length}`
        : "INV-1001";

    const newInvestigation = {
      id: newId,
      transaction: newCase.transaction.trim(),
      customer: newCase.customer.trim(),
      amount: newCase.amount.trim(),
      risk: newCase.risk,
      status: newCase.status,
    };

    setCases((previousCases) => [
      ...previousCases,
      newInvestigation,
    ]);

    setNewCase({
      transaction: "",
      customer: "",
      amount: "",
      risk: "Medium",
      status: "Open",
    });

    setShowForm(false);
  };

  // =========================
  // DELETE INVESTIGATION
  // =========================
  const handleDeleteInvestigation = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this investigation?"
    );

    if (!confirmed) {
      return;
    }

    setCases((previousCases) =>
      previousCases.filter(
        (item) => item.id !== id
      )
    );

    if (selectedCase?.id === id) {
      setSelectedCase(null);
    }
  };

  // =========================
  // FILTER CASES
  // =========================
  const filteredCases = cases.filter((item) => {
    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      item.id.toLowerCase().includes(searchText) ||
      item.transaction
        .toLowerCase()
        .includes(searchText) ||
      item.customer
        .toLowerCase()
        .includes(searchText) ||
      item.amount
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

  // =========================
  // STATISTICS
  // =========================
  const openCases = cases.filter(
    (item) => item.status === "Open"
  ).length;

  const investigatingCases = cases.filter(
    (item) => item.status === "Investigating"
  ).length;

  const highRiskCases = cases.filter(
    (item) => item.risk === "High"
  ).length;

  const reviewCases = cases.filter(
    (item) => item.status === "Review"
  ).length;

  // =========================
  // STATUS CLASS
  // =========================
  const getStatusClass = (status) => {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =========================
  // RETURN UI
  // =========================
  return (
    <div className="page-container">

      {/* =====================================
          NEW INVESTIGATION MODAL
      ====================================== */}
      {showForm && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>New Investigation</h2>

                <p>
                  Create a new fraud investigation case.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInvestigation}>

              {/* Transaction */}
              <label>
                Transaction ID
              </label>

              <input
                type="text"
                placeholder="Example: TXN-78490"
                value={newCase.transaction}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    transaction: e.target.value,
                  })
                }
                required
              />

              {/* Customer */}
              <label>
                Customer Name
              </label>

              <input
                type="text"
                placeholder="Customer Name"
                value={newCase.customer}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    customer: e.target.value,
                  })
                }
                required
              />

              {/* Amount */}
              <label>
                Transaction Amount
              </label>

              <input
                type="text"
                placeholder="Example: ₹1.5L"
                value={newCase.amount}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    amount: e.target.value,
                  })
                }
                required
              />

              {/* Risk */}
              <label>
                Risk Level
              </label>

              <select
                value={newCase.risk}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    risk: e.target.value,
                  })
                }
              >
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

              {/* Status */}
              <label>
                Investigation Status
              </label>

              <select
                value={newCase.status}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    status: e.target.value,
                  })
                }
              >
                <option value="Open">
                  Open
                </option>

                <option value="Investigating">
                  Investigating
                </option>

                <option value="Review">
                  Review
                </option>
              </select>

              {/* Buttons */}
              <div className="modal-buttons">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Create Investigation
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================
          CASE DETAILS MODAL
      ====================================== */}
      {selectedCase && (
        <div className="modal-overlay">

          <div className="modal case-details-modal">

            <div className="modal-header">

              <div>
                <h2>
                  Investigation Details
                </h2>

                <p>
                  {selectedCase.id}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setSelectedCase(null)
                }
              >
                ✕
              </button>

            </div>

            <div className="case-detail-list">

              <div className="case-detail-row">
                <span>Case ID</span>
                <strong>
                  {selectedCase.id}
                </strong>
              </div>

              <div className="case-detail-row">
                <span>Transaction</span>
                <strong>
                  {selectedCase.transaction}
                </strong>
              </div>

              <div className="case-detail-row">
                <span>Customer</span>
                <strong>
                  {selectedCase.customer}
                </strong>
              </div>

              <div className="case-detail-row">
                <span>Amount</span>
                <strong>
                  {selectedCase.amount}
                </strong>
              </div>

              <div className="case-detail-row">
                <span>Risk</span>

                <span
                  className={`risk-badge ${selectedCase.risk.toLowerCase()}`}
                >
                  {selectedCase.risk}
                </span>
              </div>

              <div className="case-detail-row">
                <span>Status</span>

                <span
                  className={`status-badge ${getStatusClass(
                    selectedCase.status
                  )}`}
                >
                  {selectedCase.status}
                </span>
              </div>

            </div>

            <div className="modal-buttons">

              <button
                className="secondary-btn"
                onClick={() =>
                  setSelectedCase(null)
                }
              >
                Close
              </button>

              <button
                className="danger-btn"
                onClick={() =>
                  handleDeleteInvestigation(
                    selectedCase.id
                  )
                }
              >
                Delete Case
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="page-header">

        <div>
          <h2>Investigations</h2>

          <p>
            Investigate suspicious financial
            transactions and fraud cases.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          + New Investigation
        </button>

      </div>

      {/* =====================================
          STATISTICS
      ====================================== */}
      <div className="investigation-stats">

        <div className="info-card">
          <span>🔍 Open Cases</span>

          <h3>{openCases}</h3>

          <small>
            Requires investigation
          </small>
        </div>

        <div className="info-card">
          <span>🔎 Investigating</span>

          <h3>{investigatingCases}</h3>

          <small>
            Currently under review
          </small>
        </div>

        <div className="info-card">
          <span>⚠️ High Risk</span>

          <h3>{highRiskCases}</h3>

          <small>
            Priority cases
          </small>
        </div>

        <div className="info-card">
          <span>📋 Total Cases</span>

          <h3>{cases.length}</h3>

          <small>
            {reviewCases} cases in review
          </small>
        </div>

      </div>

      {/* =====================================
          INVESTIGATION PANEL
      ====================================== */}
      <div className="investigation-panel">

        <div className="panel-header">

          <div>
            <h3>
              Active Investigations
            </h3>

            <small>
              Review and manage fraud cases
            </small>
          </div>

          <div className="investigation-filters">

            {/* Search */}
            <input
              type="text"
              placeholder="Search investigation..."
              className="search-input"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {/* Risk Filter */}
            <select
              className="transaction-filter"
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(e.target.value)
              }
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

            {/* Status Filter */}
            <select
              className="transaction-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Open">
                Open
              </option>

              <option value="Investigating">
                Investigating
              </option>

              <option value="Review">
                Review
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
                <th>Case ID</th>
                <th>Transaction</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredCases.length > 0 ? (

                filteredCases.map((item) => (

                  <tr key={item.id}>

                    <td>
                      <strong>
                        {item.id}
                      </strong>
                    </td>

                    <td>
                      {item.transaction}
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
                        className={`status-badge ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelectedCase(item)
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="no-investigations"
                  >
                    <div>
                      <div className="empty-icon">
                        🔍
                      </div>

                      <strong>
                        No investigations found
                      </strong>

                      <p>
                        Try changing your search
                        or filters.
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

export default Investigations;