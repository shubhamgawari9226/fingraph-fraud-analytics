import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/fraud-network";

// ======================================================
// SYNTHETIC / TEST DATA
// Used only when the backend API is unavailable.
// ======================================================

const SYNTHETIC_NODES = [
  {
    id: "CUST-001",
    label: "Customer A",
    type: "Customer",
    risk: "High",
    x: 180,
    y: 150,
  },
  {
    id: "CUST-002",
    label: "Customer B",
    type: "Customer",
    risk: "High",
    x: 450,
    y: 150,
  },
  {
    id: "CUST-003",
    label: "Customer C",
    type: "Customer",
    risk: "Low",
    x: 720,
    y: 150,
  },
  {
    id: "CUST-004",
    label: "Customer D",
    type: "Customer",
    risk: "High",
    x: 450,
    y: 390,
  },
  {
    id: "TXN-001",
    label: "₹2.4L",
    type: "Transaction",
    risk: "High",
    x: 180,
    y: 390,
  },
  {
    id: "TXN-002",
    label: "₹85K",
    type: "Transaction",
    risk: "Medium",
    x: 720,
    y: 390,
  },
  {
    id: "TXN-003",
    label: "₹42K",
    type: "Transaction",
    risk: "Low",
    x: 450,
    y: 550,
  },
];

const SYNTHETIC_CONNECTIONS = [
  {
    from: "CUST-001",
    to: "TXN-001",
    label: "Initiated",
  },
  {
    from: "CUST-002",
    to: "TXN-001",
    label: "Linked",
  },
  {
    from: "CUST-002",
    to: "TXN-002",
    label: "Initiated",
  },
  {
    from: "CUST-003",
    to: "TXN-003",
    label: "Initiated",
  },
  {
    from: "CUST-004",
    to: "TXN-002",
    label: "Linked",
  },
  {
    from: "CUST-001",
    to: "CUST-002",
    label: "Shared Device",
  },
  {
    from: "CUST-002",
    to: "CUST-004",
    label: "Shared Account",
  },
];

function FraudNetwork() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [search, setSearch] = useState("");

  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [usingSyntheticData, setUsingSyntheticData] =
    useState(false);

  const [showCircularFlow, setShowCircularFlow] = useState(false);

  // ======================================================
  // FETCH NETWORK DATA
  // ======================================================

  useEffect(() => {
  const fetchFraudNetwork = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Backend API returned status ${response.status}`
        );
      }

      const data = await response.json();

      const apiNodes = Array.isArray(data.nodes)
        ? data.nodes
        : [];

      const apiEdges = Array.isArray(data.edges)
        ? data.edges
        : [];

      setNodes(apiNodes);
      setConnections(apiEdges);

      setUsingSyntheticData(false);
    } catch (err) {
      console.warn(
        "Fraud Network API unavailable. Using synthetic test data.",
        err
      );

      setNodes(SYNTHETIC_NODES);
      setConnections(SYNTHETIC_CONNECTIONS);

      setUsingSyntheticData(true);

      setError(
        "Unable to retrieve live fraud network data from the backend. Synthetic test data is being displayed for visualization only."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchFraudNetwork();
}, []);

const retryConnection = () => {
  window.location.reload();
};

  // ======================================================
  // FIND NODE
  // ======================================================

  const getNode = (id) => {
    return nodes.find((node) => node.id === id);
  };

  // ======================================================
  // SAFE NODE VALUES
  // ======================================================

  const getNodeId = (node) => {
    return String(node?.id || "");
  };

  const getNodeLabel = (node) => {
    return String(node?.label || node?.id || "");
  };

  const getNodeType = (node) => {
    return String(node?.type || "Unknown");
  };

  const getNodeRisk = (node) => {
    return String(node?.risk || "Unknown");
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const searchText = search.trim().toLowerCase();

  const filteredNodes = nodes.filter((node) => {
    return (
      getNodeId(node).toLowerCase().includes(searchText) ||
      getNodeLabel(node).toLowerCase().includes(searchText) ||
      getNodeType(node).toLowerCase().includes(searchText) ||
      getNodeRisk(node).toLowerCase().includes(searchText)
    );
  });

  // ======================================================
  // SEARCH MATCH
  // ======================================================

  const isNodeSearchMatch = (node) => {
    if (!searchText) {
      return false;
    }

    return (
      getNodeId(node).toLowerCase().includes(searchText) ||
      getNodeLabel(node).toLowerCase().includes(searchText) ||
      getNodeType(node).toLowerCase().includes(searchText) ||
      getNodeRisk(node).toLowerCase().includes(searchText)
    );
  };

  // ======================================================
  // NODE RADIUS
  // ======================================================

  const getRadius = (node) => {
    return getNodeType(node) === "Transaction"
      ? 30
      : 38;
  };

  // ======================================================
  // NODE COLOR
  // ======================================================

  const getNodeColor = (node) => {
    const risk = getNodeRisk(node);
    const type = getNodeType(node);

    if (type === "Transaction") {
      if (risk === "High") {
        return "#f97316";
      }

      if (risk === "Medium") {
        return "#eab308";
      }

      if (risk === "Low") {
        return "#06b6d4";
      }

      return "#64748b";
    }

    if (risk === "High") {
      return "#ef4444";
    }

    if (risk === "Medium") {
      return "#f59e0b";
    }

    if (risk === "Low") {
      return "#22c55e";
    }

    return "#64748b";
  };

  // ======================================================
  // NETWORK STATISTICS
  // ======================================================

  const customerCount = nodes.filter(
    (node) => getNodeType(node) === "Customer"
  ).length;

  const transactionCount = nodes.filter(
    (node) => getNodeType(node) === "Transaction"
  ).length;

  const highRiskCount = nodes.filter(
    (node) => getNodeRisk(node) === "High"
  ).length;

  // ======================================================
  // SELECTED NODE CONNECTIONS
  // ======================================================

  const selectedConnections = selectedNode
    ? connections.filter(
        (connection) =>
          connection.from === selectedNode.id ||
          connection.to === selectedNode.id
      )
    : [];

  // ======================================================
  // CONNECTION RISK
  // ======================================================

  const getConnectionRisk = (connection) => {
    const fromNode = getNode(connection.from);
    const toNode = getNode(connection.to);

    if (!fromNode || !toNode) {
      return "Unknown";
    }

    const fromRisk = getNodeRisk(fromNode);
    const toRisk = getNodeRisk(toNode);

    if (fromRisk === "High" || toRisk === "High") {
      return "High";
    }

    if (
      fromRisk === "Medium" ||
      toRisk === "Medium"
    ) {
      return "Medium";
    }

    return "Low";
  };

  // ======================================================
  // CLEAR SEARCH
  // ======================================================

  const clearSearch = () => {
    setSearch("");
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="page-container">
        <div className="investigation-panel">
          <h3>Loading Fraud Network...</h3>

          <p>
            Retrieving network data from FinGraph API.
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="page-container">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="page-header">

        <div>
          <h2>Fraud Network</h2>

          <p>
            Visualize connections between suspicious
            accounts and transactions.
          </p>
        </div>

        <div className="network-search">

          <input
            type="text"
            placeholder="Search customer or transaction..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="search-input"
          />

          {search && (
            <button
              className="secondary-btn"
              onClick={clearSearch}
            >
              Clear
            </button>
          )}

        </div>

      </div>

      {/* ==================================================
          DATA NOTICE
      ================================================== */}

      <div className="network-data-notice">

        <strong>
          {usingSyntheticData
            ? "SYNTHETIC / TEST DATA"
            : "NETWORK DATA"}
        </strong>

        <span>
          {usingSyntheticData
            ? "Backend network data is currently unavailable. Synthetic data is being used for visualization and investigation-flow validation only."
            : "Network data loaded from the FinGraph API."}
        </span>

      </div>

      {/* ==================================================
          API WARNING
      ================================================== */}

      {usingSyntheticData && (
  <div className="network-api-warning">

    <div>
      <strong>
        Backend connection unavailable
      </strong>

      <span>
        Live fraud network data could not be retrieved.
        The visualization is currently using synthetic
        test data only.
      </span>

      <small>
        No Neo4j configuration has been changed.
      </small>
    </div>

    <button
      className="secondary-btn"
      onClick={retryConnection}
    >
      Retry
    </button>

  </div>
)}

      {/* ==================================================
          STATISTICS
      ================================================== */}

      {/* STATISTICS */}
      <div 
        className="investigation-stats" 
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}
      >

        <div className="info-card">

          <span>
            👤 Accounts
          </span>

          <h3>
            {customerCount}
          </h3>

          <small>
            Connected accounts
          </small>

        </div>

        <div className="info-card">

          <span>
            💳 Transactions
          </span>

          <h3>
            {transactionCount}
          </h3>

          <small>
            Linked transactions
          </small>

        </div>

        <div className="info-card">

          <span>
            ⚠️ High Risk
          </span>

          <h3>
            {highRiskCount}
          </h3>

          <small>
            Priority nodes
          </small>

        </div>

        {/* New Circular Flow Trigger Card */}
        <div 
          className="info-card" 
          onClick={() => {
            setShowCircularFlow(!showCircularFlow);
            setSelectedNode(null);
            setSearch("");
          }}
          style={{ 
            cursor: "pointer", 
            border: showCircularFlow ? "1px solid #a855f7" : "1px solid transparent",
            background: showCircularFlow ? "#1e1b4b" : undefined,
            transition: "all 0.2s ease"
          }}
        >
          <span>🔄 Quick Insight</span>
          <h3>Fund Flow</h3>
          <small style={{ color: showCircularFlow ? "#a855f7" : "#94a3b8" }}>
            {showCircularFlow ? "Stop Animation" : "Trace Scenario"}
          </small>
        </div>

      </div>

      {/* ==================================================
          MAIN NETWORK AREA
      ================================================== */}

      <div className="network-layout">

        {/* ==================================================
            GRAPH
        ================================================== */}

        <div className="investigation-panel network-panel">

          <div className="panel-header">

            <div>

              <h3>
                Fraud Connection Network
              </h3>

              <small>
                Click any node to view details
              </small>

            </div>

          </div>

          <div className="network-graph">

            {nodes.length === 0 ? (

              <div className="empty-node">

                <div className="empty-node-icon">
                  🕸️
                </div>

                <h3>
                  No Network Data
                </h3>

                <p>
                  No accounts or transactions are
                  available for visualization.
                </p>

              </div>

            ) : (

              <svg
                viewBox="0 0 900 650"
                className="fraud-network-svg"
                role="img"
                aria-label="Fraud connection network"
                style={{ width: "100%", height: "auto", minHeight: "400px", display: "block" }}
              >

                {/* ==================================================
                    DEFINITIONS
                ================================================== */}

                <defs>

            

                  <linearGradient
                    id="networkBackground"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#0b1220"
                    />

                    <stop
                      offset="100%"
                      stopColor="#111827"
                    />

                  </linearGradient>

                  <filter
                    id="nodeGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >

                    <feGaussianBlur
                      stdDeviation="5"
                      result="blur"
                    />

                    <feMerge>

                      <feMergeNode in="blur" />

                      <feMergeNode in="SourceGraphic" />

                    </feMerge>

                  </filter>

                  <pattern
                    id="networkGrid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >

                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1"
                      opacity="0.25"
                    />

                  </pattern>

                  {/* Arrow marker */}

                  <marker
                    id="arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >

                    <path
                      d="M0,0 L0,6 L9,3 z"
                      fill="#64748b"
                    />

                  </marker>

                  <marker
                    id="arrowSelected"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >

                    <path
                      d="M0,0 L0,6 L9,3 z"
                      fill="#38bdf8"
                    />

                  </marker>

                  {/* DEFINITIONS */}
                
                  <style>
                    {`
                      @keyframes flowAnimation {
                        to { stroke-dashoffset: -20; }
                      }
                      .flow-path {
                        animation: flowAnimation 1s linear infinite;
                      }
                      .node-group {
                        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-in-out;
                      }
                      .node-group:hover {
                        transform: scale(1.08);
                      }
                    `}
                  </style>

                </defs>

                {/* ==================================================
                    BACKGROUND
                ================================================== */}

                <rect
                  x="0"
                  y="0"
                  width="900"
                  height="650"
                  rx="18"
                  fill="url(#networkBackground)"
                />

                <rect
                  x="0"
                  y="0"
                  width="900"
                  height="650"
                  rx="18"
                  fill="url(#networkGrid)"
                />

                {/* ==================================================
                    CONNECTIONS
                ================================================== */}

                {connections.map(
                  (connection, index) => {

                    const fromNode = getNode(
                      connection.from
                    );

                    const toNode = getNode(
                      connection.to
                    );

                    if (
                      !fromNode ||
                      !toNode
                    ) {
                      return null;
                    }

                    const isSelectedConnection =
                      selectedNode &&
                      (
                        connection.from ===
                          selectedNode.id ||
                        connection.to ===
                          selectedNode.id
                      );

                    const isSearchConnection = searchText && (isNodeSearchMatch(fromNode) || isNodeSearchMatch(toNode));

                  // NEW: Circular flow path definitions
                  const isCircularEdge = (
                    (connection.from === "CUST-001" && connection.to === "TXN-001") ||
                    (connection.from === "CUST-002" && connection.to === "TXN-001") ||
                    (connection.from === "CUST-002" && connection.to === "TXN-002") ||
                    (connection.from === "CUST-004" && connection.to === "TXN-002") ||
                    (connection.from === "CUST-002" && connection.to === "CUST-004")
                  );

                  let isDimmed = false;
                  if (showCircularFlow) {
                    isDimmed = !isCircularEdge;
                  } else {
                    isDimmed = (searchText && !isSearchConnection) || (selectedNode && !isSelectedConnection);
                  }

                  const isHighRiskCommunity = getNodeRisk(fromNode) === "High" && getNodeRisk(toNode) === "High";

                  const lineColor = showCircularFlow && isCircularEdge
                    ? "#a855f7" // Purple glowing path
                    : isSelectedConnection
                    ? "#38bdf8"
                    : isSearchConnection
                    ? "#facc15"
                    : isHighRiskCommunity
                    ? "#ef4444"
                    : "#475569";

                    return (
                      <g
                        key={`${connection.from}-${connection.to}-${index}`}
                        opacity={
                          isDimmed
                            ? 0.2
                            : 0.9
                        }
                      >

                        {/* Relationship line */}
                      <line
                        className={showCircularFlow && isCircularEdge ? "flow-path" : ""}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={lineColor}
                        strokeWidth={isSelectedConnection || isSearchConnection || (showCircularFlow && isCircularEdge) ? 5 : 2.5}
                        strokeLinecap="round"
                        strokeDasharray={
                          showCircularFlow && isCircularEdge
                            ? "8 6" 
                            : connection.label === "Shared Device" || connection.label === "Shared Account"
                            ? "8 5"
                            : undefined
                        }
                        markerEnd={isSelectedConnection ? "url(#arrowSelected)" : "url(#arrow)"}
                      />
                        {/* Relationship label */}

                       {/* Relationship label */}
                        
                      <g
                        transform={`translate(
                          ${(fromNode.x + toNode.x) / 2},
                          ${(fromNode.y + toNode.y) / 2 - 14}
                        )`}
                      >
                        <rect
                          x="-55"
                          y="-10"
                          width="110"
                          height="20"
                          rx="6"
                          fill={isHighRiskCommunity && !isSelectedConnection ? "#450a0a" : "#0f172a"}
                          stroke={isHighRiskCommunity && !isSelectedConnection ? "#ef4444" : "none"}
                          strokeWidth="1"
                          opacity="0.95"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill={
                            isSelectedConnection
                              ? "#38bdf8"
                              : isHighRiskCommunity
                              ? "#fca5a5"
                              : "#cbd5e1"
                          }
                          fontSize="9"
                          fontWeight="600"
                        >
                          {isHighRiskCommunity ? `⚠️ ${connection.label || "Connected"}` : (connection.label || "Connected")}
                        </text>
                      </g>

                      </g>
                    );
                  }
                )}

                {/* ==================================================
                    NODES
                ================================================== */}

                {nodes.map((node) => {

                  const nodeId =
                    getNodeId(node);

                  const nodeLabel =
                    getNodeLabel(node);

                  const nodeType =
                    getNodeType(node);

                  const nodeRisk =
                    getNodeRisk(node);

                  const nodeColor =
                    getNodeColor(node);

                  const radius =
                    getRadius(node);

                  const isSelected = selectedNode?.id === nodeId;
                  const isSearchMatch = isNodeSearchMatch(node);
                  const isVisible = !searchText || filteredNodes.some((item) => item.id === nodeId);

                  if (!isVisible) return null;

                  // Check if this node is connected to the currently selected node
                  const isConnectedToSelected =
                    selectedNode &&
                    connections.some(
                      (c) =>
                        (c.from === selectedNode.id && c.to === nodeId) ||
                        (c.to === selectedNode.id && c.from === nodeId)
                    );

                  // NEW: Identify nodes inside the circular flow scenario
                  const inCircularFlow = ["CUST-001", "TXN-001", "CUST-002", "TXN-002", "CUST-004"].includes(nodeId);

                  // Determine opacity based on active mode
                  let nodeOpacity = 1;
                  if (showCircularFlow) {
                    nodeOpacity = inCircularFlow ? 1 : 0.15;
                  } else if (searchText) {
                    nodeOpacity = isSearchMatch ? 1 : 0.2;
                  } else if (selectedNode) {
                    nodeOpacity = isSelected || isConnectedToSelected ? 1 : 0.2;
                  }

                  return (
                    <g
                      key={nodeId}
                      className="node-group"
                      onClick={() => setSelectedNode(node)}
                      style={{
                        cursor: "pointer",
                        opacity: nodeOpacity,
                        transformOrigin: `${node.x}px ${node.y}px`
                      }}
                    >

                      {/* Selected ring */}

                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={
                            radius + 17
                          }
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="4"
                          filter="url(#nodeGlow)"
                        />
                      )}

                      {/* Search ring */}

                      {isSearchMatch && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={
                            radius + 12
                          }
                          fill="none"
                          stroke="#facc15"
                          strokeWidth="3"
                          strokeDasharray="7 5"
                        />
                      )}

                      {/* Main node */}

                     {/* Main node */}

                     {nodeType === "Customer" ? (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius}
                          fill="#0f172a"
                          stroke={nodeColor}
                          strokeWidth="5"
                          filter={
                            isSelected
                           ? "url(#nodeGlow)"
                           : undefined
                          }
                         />
                      ) : (
                        <rect
                           x={node.x - 30}
                           y={node.y - 30}
                           width="60"
                           height="60"
                            rx="14"
                           fill="#0f172a"
                            stroke={nodeColor}
                           strokeWidth="5"
                           filter={
                            isSelected
                              ? "url(#nodeGlow)"
                             : undefined
                         }
                       />
                     )}

                      {/* Inner node */}

                      

                      {nodeType === "Customer" ? (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius - 9}
                          fill={nodeColor}
                          opacity="0.18"
                        />
                      ) : (
                        <rect
                          x={node.x - 21}
                          y={node.y - 21}
                          width="42"
                          height="42"
                          rx="10"
                          fill={nodeColor}
                          opacity="0.18"
                       />
                     )}

                     {/* Icon */}

                      <text
                       x={node.x}
                       y={node.y + 7}
                       textAnchor="middle"
                       fontSize="20"
                       fontWeight="700"
                       fill="#ffffff"
                     >
                        {nodeType === "Customer" ? "👤" : "₹"}
                     </text>
                     {/* Risk */}

                      <text
                       x={node.x}
                       y={node.y - radius - 20}
                       textAnchor="middle"
                       fill={nodeColor}
                       fontSize="11"
                       fontWeight="700"
                      >
                       {nodeRisk.toUpperCase()} RISK
                      </text>

                      {/* Node Label */}

                      <text
                        x={node.x}
                        y={node.y + radius + 20}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="13"
                        fontWeight="600"
                      >
                       {nodeLabel}
                      </text>

                      {/* Node ID */}

                      <text
                        x={node.x}
                        y={node.y + radius + 36}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                      >
                       {nodeId}
                      </text>

                      {/* Node Type */}

                      <text
                       x={node.x}
                       y={node.y + radius + 50}
                       textAnchor="middle"
                       fill="#64748b"
                       fontSize="10"
                      >
                       {nodeType}
                      </text>

                    </g>
                  );
                })}

              </svg>

            )}

          </div>

          {/* ==================================================
              LEGEND
          ================================================== */}

          <div className="network-legend">

            <span>
              <i className="legend-dot high"></i>
              High Risk
            </span>

            <span>
              <i className="legend-dot medium"></i>
              Medium Risk
            </span>

            <span>
              <i className="legend-dot low"></i>
              Low Risk
            </span>

            <span>
              👤 Customer
            </span>

            <span>
              ₹ Transaction
            </span>

          </div>

        </div>

        {/* ==================================================
            NODE DETAILS
        ================================================== */}

        <div className="investigation-panel network-details">

          <div className="panel-header">

            <h3>
              Node Details
            </h3>

          </div>

          {selectedNode ? (

            <div className="node-details-content">

              <div className="selected-node-icon">

                {getNodeType(selectedNode) ===
                "Customer"
                  ? "👤"
                  : "₹"}

              </div>

              <h3>
                {getNodeLabel(selectedNode)}
              </h3>

              <p className="node-id">
                {getNodeId(selectedNode)}
              </p>

              <div className="detail-row">

                <span>
                  Type
                </span>

                <strong>
                  {getNodeType(selectedNode)}
                </strong>

              </div>

              <div className="detail-row">

                <span>
                  Risk
                </span>

                <strong
                  className={`risk-text ${getNodeRisk(
                    selectedNode
                  ).toLowerCase()}`}
                >
                  {getNodeRisk(selectedNode)}
                </strong>

              </div>

              <div className="detail-row">

                <span>
                  Connections
                </span>

                <strong>
                  {selectedConnections.length}
                </strong>

              </div>

              {/* Connected entities */}

              <div className="node-connections">

                <h4>
                  Connected Entities
                </h4>

                {selectedConnections.length ===
                0 ? (

                  <p>
                    No connected entities found.
                  </p>

                ) : (

                  selectedConnections.map(
                    (connection, index) => {

                      const connectedId =
                        connection.from ===
                        selectedNode.id
                          ? connection.to
                          : connection.from;

                      const connectedNode =
                        getNode(
                          connectedId
                        );

                      if (
                        !connectedNode
                      ) {
                        return null;
                      }

                      return (
                        <div
                          className="node-connection-item"
                          key={`${connectedId}-${index}`}
                        >

                          <span>

                            {getNodeType(
                              connectedNode
                            ) ===
                            "Customer"
                              ? "👤"
                              : "₹"}

                          </span>

                          <div>

                            <strong>
                              {getNodeLabel(
                                connectedNode
                              )}
                            </strong>

                            <small>
                              {connection.label ||
                                "Connected"}
                            </small>

                          </div>

                          <span
                            className={`risk-badge ${getNodeRisk(
                              connectedNode
                            ).toLowerCase()}`}
                          >
                            {getNodeRisk(
                              connectedNode
                            )}
                          </span>

                        </div>
                      );
                    }
                  )

                )}

              </div>

              <button
                className="secondary-btn"
                onClick={() =>
                  setSelectedNode(null)
                }
              >
                Clear Selection
              </button>

            </div>

          ) : (

            <div className="empty-node">

              <div className="empty-node-icon">
                🕸️
              </div>

              <h3>
                Select a node
              </h3>

              <p>
                Click any customer or transaction
                in the network to view its details.
              </p>

            </div>

          )}

        </div>

      

      </div>

      {/* ==================================================
          SUSPICIOUS CONNECTIONS
      ================================================== */}

      <div className="investigation-panel suspicious-connections">

        <div className="panel-header">

          <div>

            <h3>
              Suspicious Connections
            </h3>

            <small>
              Potential relationships requiring review
            </small>

          </div>

        </div>

        <div className="connection-list">

          {connections.length === 0 ? (

            <div className="empty-node">

              <p>
                No connections available.
              </p>

            </div>

          ) : (

            connections.map(
              (connection, index) => {

                const fromNode =
                  getNode(connection.from);

                const toNode =
                  getNode(connection.to);

                if (
                  !fromNode ||
                  !toNode
                ) {
                  return null;
                }

                const connectionRisk =
                  getConnectionRisk(
                    connection
                  );

                const isSelected =
                  selectedNode &&
                  (
                    connection.from ===
                      selectedNode.id ||
                    connection.to ===
                      selectedNode.id
                  );

                return (
                  <div
                    className={`connection-item ${
                      isSelected
                        ? "selected-connection"
                        : ""
                    }`}
                    key={`${connection.from}-${connection.to}-${index}`}
                    onClick={() => {

                      if (
                        fromNode
                      ) {
                        setSelectedNode(
                          fromNode
                        );
                      }

                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >

                    {/* FROM */}

                    <div className="connection-node">

                      <span>
                        {getNodeType(
                          fromNode
                        ) ===
                        "Customer"
                          ? "👤"
                          : "₹"}
                      </span>

                      <strong>
                        {getNodeLabel(
                          fromNode
                        )}
                      </strong>

                    </div>

                    {/* ARROW */}

                    <div className="connection-arrow">
                      →
                    </div>

                    {/* TO */}

                    <div className="connection-node">

                      <span>
                        {getNodeType(
                          toNode
                        ) ===
                        "Customer"
                          ? "👤"
                          : "₹"}
                      </span>

                      <strong>
                        {getNodeLabel(
                          toNode
                        )}
                      </strong>

                    </div>

                    {/* RELATIONSHIP */}

                    <div className="connection-type">

                      {connection.label ||
                        "Connected"}

                    </div>

                    {/* RISK */}

                    <span
                      className={`risk-badge ${connectionRisk.toLowerCase()}`}
                    >
                      {connectionRisk}
                    </span>

                  </div>
                );
              }
            )

          )}

        </div>

      </div>

    </div>
  );
}

export default FraudNetwork;