import { useState } from "react";

function AccountInvestigation() {
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const accounts = [
    {
      id: "CUST-001",
      name: "Customer A",
      email: "customer.a@fingraph.com",
      phone: "+91 98765 43210",
      risk: "High",
      status: "Under Investigation",
      transactions: 24,
      suspicious: 5,
      totalAmount: "₹8.4L",
      joined: "12 Jan 2025",
    },
    {
      id: "CUST-002",
      name: "Customer B",
      email: "customer.b@fingraph.com",
      phone: "+91 97654 32109",
      risk: "Medium",
      status: "Review",
      transactions: 18,
      suspicious: 2,
      totalAmount: "₹4.2L",
      joined: "28 Feb 2025",
    },
    {
      id: "CUST-003",
      name: "Customer C",
      email: "customer.c@fingraph.com",
      phone: "+91 96543 21098",
      risk: "Low",
      status: "Active",
      transactions: 31,
      suspicious: 0,
      totalAmount: "₹2.8L",
      joined: "05 Mar 2025",
    },
    {
      id: "CUST-004",
      name: "Customer D",
      email: "customer.d@fingraph.com",
      phone: "+91 95432 10987",
      risk: "High",
      status: "Blocked",
      transactions: 12,
      suspicious: 4,
      totalAmount: "₹6.1L",
      joined: "19 Apr 2025",
    },
    {
      id: "CUST-005",
      name: "Customer E",
      email: "customer.e@fingraph.com",
      phone: "+91 94321 09876",
      risk: "Medium",
      status: "Review",
      transactions: 20,
      suspicious: 1,
      totalAmount: "₹3.6L",
      joined: "21 May 2025",
    },
  ];

  const filteredAccounts = accounts.filter((account) => {
    const searchText = search.toLowerCase();

    return (
      account.id.toLowerCase().includes(searchText) ||
      account.name.toLowerCase().includes(searchText) ||
      account.email.toLowerCase().includes(searchText) ||
      account.risk.toLowerCase().includes(searchText) ||
      account.status.toLowerCase().includes(searchText)
    );
  });

  const highRiskCount = accounts.filter(
    (account) => account.risk === "High"
  ).length;

  const mediumRiskCount = accounts.filter(
    (account) => account.risk === "Medium"
  ).length;

  const investigatedCount = accounts.filter(
    (account) => account.status === "Under Investigation"
  ).length;

  return (
    <div className="page-container">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="page-header">

        <div>
          <h2>Account Investigation</h2>

          <p>
            Investigate customer accounts, risk levels,
            and suspicious activity.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search account..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* =========================
          STATISTICS
      ========================== */}

      <div className="investigation-stats">

        <div className="info-card">
          <span>👤 Total Accounts</span>
          <h3>{accounts.length}</h3>
          <small>Accounts monitored</small>
        </div>

        <div className="info-card">
          <span>🔴 High Risk</span>
          <h3>{highRiskCount}</h3>
          <small>Priority accounts</small>
        </div>

        <div className="info-card">
          <span>🟡 Medium Risk</span>
          <h3>{mediumRiskCount}</h3>
          <small>Require review</small>
        </div>

        <div className="info-card">
          <span>🔍 Investigations</span>
          <h3>{investigatedCount}</h3>
          <small>Active investigations</small>
        </div>

      </div>

      {/* =========================
          ACCOUNT RECORDS
      ========================== */}

      <div className="investigation-panel account-panel">

        <div className="panel-header">

          <div>
            <h3>Customer Accounts</h3>

            <small>
              Select an account to view investigation details
            </small>
          </div>

        </div>

        <div className="account-table-container">

          <table>

            <thead>
              <tr>
                <th>Account ID</th>
                <th>Customer</th>
                <th>Risk</th>
                <th>Transactions</th>
                <th>Suspicious</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredAccounts.length > 0 ? (

                filteredAccounts.map((account) => (

                  <tr key={account.id}>

                    <td>
                      <strong>{account.id}</strong>
                    </td>

                    <td>
                      <div className="account-name">
                        <span className="account-avatar">
                          👤
                        </span>

                        {account.name}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`risk-badge ${account.risk.toLowerCase()}`}
                      >
                        {account.risk}
                      </span>
                    </td>

                    <td>
                      {account.transactions}
                    </td>

                    <td>
                      <strong>
                        {account.suspicious}
                      </strong>
                    </td>

                    <td>
                      {account.totalAmount}
                    </td>

                    <td>
                      <span
                        className={`account-status ${account.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {account.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="investigate-btn"
                        onClick={() =>
                          setSelectedAccount(account)
                        }
                      >
                        Investigate
                      </button>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="no-accounts"
                  >
                    🔍 No accounts found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================
          SELECTED ACCOUNT DETAILS
      ========================== */}

      {selectedAccount && (

        <div className="investigation-panel account-details-panel">

          <div className="panel-header">

            <div>
              <h3>Account Investigation Details</h3>

              <small>
                Detailed information about the selected customer
              </small>
            </div>

            <button
              className="secondary-btn"
              onClick={() =>
                setSelectedAccount(null)
              }
            >
              ✕ Close
            </button>

          </div>

          <div className="account-profile">

            <div className="profile-section">

              <div className="large-account-avatar">
                👤
              </div>

              <div>

                <h2>
                  {selectedAccount.name}
                </h2>

                <p>
                  {selectedAccount.id}
                </p>

                <span
                  className={`risk-badge ${selectedAccount.risk.toLowerCase()}`}
                >
                  {selectedAccount.risk} Risk
                </span>

              </div>

            </div>

            <div className="account-information">

              <div className="account-info-item">
                <span>Email</span>
                <strong>
                  {selectedAccount.email}
                </strong>
              </div>

              <div className="account-info-item">
                <span>Phone</span>
                <strong>
                  {selectedAccount.phone}
                </strong>
              </div>

              <div className="account-info-item">
                <span>Joined</span>
                <strong>
                  {selectedAccount.joined}
                </strong>
              </div>

              <div className="account-info-item">
                <span>Status</span>
                <strong>
                  {selectedAccount.status}
                </strong>
              </div>

            </div>

          </div>

          {/* ACCOUNT METRICS */}

          <div className="account-metrics">

            <div className="metric-card">
              <span>💳 Transactions</span>
              <strong>
                {selectedAccount.transactions}
              </strong>
              <small>Total transactions</small>
            </div>

            <div className="metric-card">
              <span>⚠️ Suspicious</span>
              <strong>
                {selectedAccount.suspicious}
              </strong>
              <small>Flagged transactions</small>
            </div>

            <div className="metric-card">
              <span>💰 Total Amount</span>
              <strong>
                {selectedAccount.totalAmount}
              </strong>
              <small>Transaction value</small>
            </div>

            <div className="metric-card">
              <span>🛡️ Risk Level</span>
              <strong
                className={`risk-text ${selectedAccount.risk.toLowerCase()}`}
              >
                {selectedAccount.risk}
              </strong>
              <small>Current assessment</small>
            </div>

          </div>

          {/* INVESTIGATION SUMMARY */}

          <div className="investigation-summary">

            <h3>Investigation Summary</h3>

            <p>
              This account is currently classified as{" "}
              <strong>
                {selectedAccount.risk} Risk
              </strong>
              . The account has{" "}
              <strong>
                {selectedAccount.suspicious}
              </strong>{" "}
              suspicious transaction(s) requiring
              monitoring and review.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default AccountInvestigation;          
