# FinGraph – Complex Cypher Query Design

## 1. Objective

The objective of this work is to design and optimize high-throughput Cypher queries for FinGraph fraud and syndicate graph analytics (shubhamgawari9226).

According to the project requirements, the Week 2 Analytics work focuses on:

- Detecting circular money flows using graph relationships.
- Identifying the circular pattern A → B → C → A.
- Calculating risk scores for graph nodes.
- Preparing queries that can later be executed and verified against the Neo4j FingraphDB database.

This document defines the query logic, required graph patterns, risk-score methodology, and planned verification approach.

---

## 2. Official Week 2 Analytics Requirement

The official FinGraph project document specifies the following Week 2 Analytics requirement:

> "Cypher Queries: Write complex Cypher queries to detect circular money flows (A → B → C → A) and calculate node risk scores."

Therefore, the primary focus is on graph-based fraud detection rather than isolated transaction-level analysis.

---

## 3. Existing FinGraph Graph Structure

The Week 1 project specification defines the initial Neo4j graph schema using:

### Nodes

- Person
- Account
- Bank

### Relationship

- TRANSFERRED_TO

The graph represents financial entities and money-transfer relationships as connected graph structures rather than treating transactions only as independent rows.

The exact graph structure currently available in FingraphDB should be confirmed during query execution.

---

## 4. Circular Money Flow Definition

A circular money flow occurs when money moves through multiple connected entities and eventually returns to the original entity.

The required project example is:

A → B → C → A

Where:

- A is the starting account/entity.
- B receives funds from A.
- C receives funds from B.
- A receives funds from C.

This pattern is important because circular transfers can indicate attempts to obscure the original source or destination of funds.

---

## 5. Circular Flow Detection Logic

The Cypher query should identify a three-step directed transfer path where:

Start → Intermediate 1 → Intermediate 2 → Start

Conceptually:

A -[:TRANSFERRED_TO]-> B
B -[:TRANSFERRED_TO]-> C
C -[:TRANSFERRED_TO]-> A

The query should ensure that the three participating nodes are distinct:

A ≠ B
B ≠ C
C ≠ A

The query should also avoid reporting the same circular flow repeatedly where possible.

---

## 6. Circular Money Flow Cypher Design

A basic three-node circular-flow detection query can be structured as:

MATCH (a)-[:TRANSFERRED_TO]->(b)
      -[:TRANSFERRED_TO]->(c)
      -[:TRANSFERRED_TO]->(a)
WHERE a <> b
  AND b <> c
  AND c <> a
RETURN
    a,
    b,
    c;

This query represents the required:

A → B → C → A

pattern.

The query is intended as the initial design and should be adapted if the actual Neo4j relationship properties or transaction structure require additional conditions.

---

## 7. Avoiding Duplicate Circular Paths

Because a circular path can be represented from different starting points, duplicate results may occur.

For example:

A → B → C → A
B → C → A → B
C → A → B → C

represent the same three-node cycle.

A refined query can establish a consistent ordering between node identifiers when suitable identifiers are available.

Example:

MATCH (a)-[:TRANSFERRED_TO]->(b)
      -[:TRANSFERRED_TO]->(c)
      -[:TRANSFERRED_TO]->(a)
WHERE a <> b
  AND b <> c
  AND c <> a
  AND a.account_id < b.account_id
  AND a.account_id < c.account_id
RETURN
    a.account_id AS account_a,
    b.account_id AS account_b,
    c.account_id AS account_c;

The exact identifier property must be adjusted to match the implemented Neo4j schema.

---

## 8. Circular Flow Information to Return

For fraud-analysis documentation, the final query output should ideally provide useful information about each detected cycle.

Potential output fields include:

- Starting account/entity
- Intermediate account/entity
- Final account/entity
- Number of transfer relationships
- Related transaction information
- Transaction amounts, if stored on the relationship
- Transaction timestamps, if available
- Currency information, if available

A more detailed query can be developed after confirming the actual relationship properties in FingraphDB.

---

## 9. Node Risk Score Requirement

The second major Week 2 Analytics requirement is to calculate a risk score for graph nodes.

The purpose of the score is to prioritize accounts or entities that demonstrate multiple suspicious characteristics.

A node risk score can combine transaction-level indicators with graph-level indicators.

The available transaction dataset contains fields that can support risk analysis, including:

- txn_amount
- foreign_txn_flag
- txn_count_past_hour
- fraud_label
- risk_index
- merchant_type
- country_code
- payment_channel
- km_from_home

These fields can be considered when designing the risk-scoring methodology.

---

## 10. Proposed Risk-Score Factors

The risk-score design should consider multiple indicators instead of relying on a single condition.

### High transaction frequency

A high value of:

txn_count_past_hour

can indicate unusually frequent transaction activity.

### Foreign transaction activity

The:

foreign_txn_flag

can identify transactions involving foreign activity.

### Existing risk index

The dataset's:

risk_index

can contribute to the overall risk assessment.

### Fraud classification

The:

fraud_label

field can be used for analytical validation and comparison where appropriate.

### Transaction amount

Large transaction amounts can be considered as an additional risk indicator depending on the project's scoring rules.

### Graph connectivity

An account involved in multiple suspicious transfer relationships or circular flows can receive additional graph-based risk weight.

---

## 11. Proposed Risk-Score Design

The final risk-score formula should be implemented only after confirming the available Neo4j properties and the team's agreed scoring rules.

A conceptual weighted model can be represented as:

Node Risk Score =
    Transaction Risk
    + Frequency Risk
    + Foreign Transaction Risk
    + Graph Connectivity Risk
    + Circular Flow Risk

The purpose of this model is to combine transaction-level and graph-level evidence.

The exact numerical weights should be documented after the scoring rules are finalized and tested.

---

## 12. Planned Cypher Risk-Score Analysis

Once the actual Neo4j property structure is confirmed, the risk-score query can aggregate suspicious indicators for each account.

The general design is:

MATCH (a:Account)
OPTIONAL MATCH (a)-[:TRANSFERRED_TO]->(b:Account)
WITH a,
     count(b) AS outgoing_connections
RETURN
    a.account_id AS account_id,
    outgoing_connections
ORDER BY outgoing_connections DESC;

This initial query measures graph connectivity.

Additional transaction-level properties and circular-flow indicators can then be incorporated into the final risk-score query.

The exact query will depend on whether transaction information is stored directly on nodes, relationships, or separate transaction nodes.

---

## 13. Verification Plan

The designed Cypher queries will be verified against the FingraphDB Neo4j database after implementation.

### Circular-flow verification

- Execute the A → B → C → A query.
- Record the number of detected cycles.
- Capture representative sample results.
- Check that the participating nodes are distinct.
- Confirm that the detected relationships follow the expected direction.

### Risk-score verification

- Execute the node-risk analysis.
- Confirm that accounts are returned with calculated indicators.
- Check the highest-risk accounts.
- Compare results with known suspicious transaction information where appropriate.
- Record the final query output for documentation.

Actual verification results will be added after the queries are executed.

---

## 14. Expected Outputs

The completed Analytics work is expected to provide:

1. A Cypher query for detecting A → B → C → A circular money flows.
2. Logic for reducing duplicate representations of the same cycle.
3. A method for identifying graph connectivity associated with suspicious activity.
4. A node risk-score methodology.
5. Cypher logic for calculating or aggregating risk indicators.
6. Verification results from the Neo4j FingraphDB environment.
7. Sample suspicious circular-flow records.
8. A documented basis for further graph-based fraud analytics.

---

## 15. Analytics Considerations

Circular money flows should not automatically be treated as confirmed fraud.

A detected cycle represents a potentially suspicious graph pattern that requires further analysis.

Risk scoring should therefore be treated as an analytical prioritization mechanism rather than a final fraud decision.

Multiple signals should be considered together, including:

- Transaction frequency
- Foreign transaction activity
- Transaction risk indicators
- Transaction amount
- Graph connectivity
- Circular transfer patterns

This approach helps reduce dependence on a single fraud rule.

---

## 16. Limitations

The current design has the following limitations:

- The exact Neo4j relationship properties must be confirmed before finalizing the detailed query.
- The current document defines the query logic but does not contain execution results.
- Risk-score weights have not been finalized.
- A circular transaction pattern alone does not prove fraudulent activity.
- The final risk-score query depends on how transaction attributes are represented in the Neo4j graph.
- Duplicate cycle handling may need to be adjusted according to the actual account identifier properties.

---

## 17. Next Steps

The next steps are:

1. Confirm the current Neo4j node and relationship properties.
2. Execute the circular money-flow Cypher query.
3. Verify the A → B → C → A results.
4. Refine the query if duplicate or incorrect paths are returned.
5. Implement the node risk-score calculation.
6. Execute and verify the risk-score analysis.
7. Record actual Neo4j outputs.
8. Update the Analytics documentation with verified results.

---

## 18. Conclusion

This document establishes the Cypher query design required for the FinGraph Week 2 Analytics work.

The primary analytical focus is the detection of circular money flows represented by:

A → B → C → A

along with the development of node-level risk scoring.

The queries documented here provide the foundation for the next stage of implementation and verification in Neo4j. Actual execution results will be added after the queries are tested against the FingraphDB environment.