import { useState } from "react";

function InvestigationDetails() {
  const [status, setStatus] = useState("Under Investigation");
  const [note, setNote] = useState("");

  const investigation = {
    id: "INV-1024",
    transactionId: "TXN-78421",
    customer: "Customer A",
    account: "CUST-001",
    amount: "₹2.4L",
    date: "17 Aug 2026",
    risk: "Critical",
    reason: "Unusual high-value transaction",
    analyst: "Analyst",
  };

  const handleResolve = () => {
    setStatus("Resolved");
  };

  const handleAddNote = () => {
    if (!note.trim()) return;

    alert("Investigation note added successfully.");
    setNote("");
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">

        <div>
          <h2>Investigation Details</h2>
          <p>
            Review and manage suspicious fraud investigations.
          </p>
        </div>

        <span className={`investigation-status ${status
          .toLowerCase()
          .replaceAll(" ", "-")}`}>
          {status}
        </span>

      </div>

      {/* Case Overview */}
      <div className="investigation-stats">

        <div className="info-card">
          <span>🔎 Investigation ID</span>
          <h3>{investigation.id}</h3>
          <small>Active fraud case</small>
        </div>

        <div className="info-card">
          <span>💳 Transaction</span>
          <h3>{investigation.transactionId}</h3>
          <small>{investigation.amount}</small>
        </div>

        <div className="info-card">
          <span>🔴 Risk Level</span>
          <h3>{investigation.risk}</h3>
          <small>Immediate attention required</small>
        </div>

        <div className="info-card">
          <span>👤 Analyst</span>
          <h3>{investigation.analyst}</h3>
          <small>Assigned investigator</small>
        </div>

      </div>

      {/* Main Investigation Content */}
      <div className="investigation-details-grid">

        {/* Transaction Information */}
        <div className="investigation-panel">

          <div className="panel-header">
            <div>
              <h3>Transaction Information</h3>
              <small>Suspicious transaction details</small>
            </div>
          </div>

          <div className="details-list">

            <div className="detail-row">
              <span>Transaction ID</span>
              <strong>{investigation.transactionId}</strong>
            </div>

            <div className="detail-row">
              <span>Customer</span>
              <strong>{investigation.customer}</strong>
            </div>

            <div className="detail-row">
              <span>Account ID</span>
              <strong>{investigation.account}</strong>
            </div>

            <div className="detail-row">
              <span>Amount</span>
              <strong>{investigation.amount}</strong>
            </div>

            <div className="detail-row">
              <span>Date</span>
              <strong>{investigation.date}</strong>
            </div>

            <div className="detail-row">
              <span>Risk</span>
              <span className="risk-badge critical">
                {investigation.risk}
              </span>
            </div>

            <div className="detail-row">
              <span>Reason</span>
              <strong>{investigation.reason}</strong>
            </div>

          </div>

        </div>

        {/* Investigation Actions */}
        <div className="investigation-panel">

          <div className="panel-header">
            <div>
              <h3>Investigation Actions</h3>
              <small>Update case status</small>
            </div>
          </div>

          <div className="action-section">

            <label>Investigation Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="transaction-filter"
            >
              <option>Under Investigation</option>
              <option>Pending Review</option>
              <option>Resolved</option>
            </select>

            <button
              className="resolve-button"
              onClick={handleResolve}
            >
              ✓ Mark as Resolved
            </button>

          </div>

        </div>

      </div>

      {/* Notes */}
      <div className="investigation-panel">

        <div className="panel-header">
          <div>
            <h3>Investigation Notes</h3>
            <small>Add observations or investigation findings</small>
          </div>
        </div>

        <textarea
          className="investigation-notes"
          placeholder="Enter investigation notes..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          className="note-button"
          onClick={handleAddNote}
        >
          + Add Investigation Note
        </button>

      </div>

      {/* Timeline */}
      <div className="investigation-panel">

        <div className="panel-header">
          <div>
            <h3>Investigation Timeline</h3>
            <small>Recent case activity</small>
          </div>
        </div>

        <div className="timeline">

          <div className="timeline-item">
            <span>🚨</span>
            <div>
              <strong>Fraud alert generated</strong>
              <p>17 Aug 2026 • 10:42 AM</p>
            </div>
          </div>

          <div className="timeline-item">
            <span>🔍</span>
            <div>
              <strong>Investigation started</strong>
              <p>17 Aug 2026 • 11:05 AM</p>
            </div>
          </div>

          <div className="timeline-item">
            <span>👤</span>
            <div>
              <strong>Assigned to Analyst</strong>
              <p>17 Aug 2026 • 11:12 AM</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default InvestigationDetails;