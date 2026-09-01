# FinGraph – Fraud Analytics

## 1. Objective

FinGraph is a real-time fraud syndicate analytics project. This
analysis uses the imported transaction graph in Neo4j/FingraphDB to
identify suspicious transactions, high-risk activity, foreign
transaction patterns, merchant patterns, and transaction-frequency
behavior.

The analysis was performed using Cypher queries on the shared
FingraphDB Neo4j instance.

---

## 2. Neo4j Graph Verification

The latest verified FingraphDB analytics report contains the
following nodes:

| Node Type | Count |
|---|---:|
| Account | 2,120 |
| Card | 2,150 |
| Location | 19 |
| Merchant | 19 |
| Transaction | 2,150 |

The graph structure and fraud-analysis queries were successfully
verified on the shared FingraphDB setup.

---

## 3. Suspicious Transaction Analysis

### Query

```cypher
MATCH (t:Transaction)
RETURN 
    count(t) AS total_transactions,
    count(CASE WHEN t.fraud_label = 'suspicious' THEN 1 END) AS suspicious_transactions,
    round(100.0 * count(CASE WHEN t.fraud_label = 'suspicious' THEN 1 END) / count(t), 2) AS suspicious_rate_pct;
```

### Result

- Total transactions: 2,150
- Suspicious transactions: 150
- Suspicious transaction rate: 6.98%

The suspicious transaction count confirms that 150 transactions in
the dataset are labelled as suspicious.

---

## 4. Top Suspicious Transaction Analysis

### Query

```cypher
MATCH (t:Transaction)
WHERE t.fraud_label = 'suspicious'
RETURN
    t.txn_id,
    t.txn_amount,
    t.risk_index
ORDER BY t.risk_index DESC
LIMIT 10;
```

### Verified Samples

| Transaction ID | Amount | Risk Index |
|---|---:|---:|
| 72710ccb... | 993.63 | 0.990 |
| 5741d3ca... | 790.70 | 0.990 |
| 3831ae9c... | 992.77 | 0.989 |
| 8c9c317b... | 2713.98 | 0.985 |
| 4bf8d7ca... | 249.98 | 0.984 |

The highest observed risk score in the verified suspicious transaction
samples is 0.990.

---

## 5. High-Risk Transaction Analysis

### Query

```cypher
MATCH (t:Transaction)
WHERE t.risk_index >= 0.658
RETURN
    t.txn_id,
    t.txn_amount,
    t.risk_index,
    t.fraud_label
ORDER BY t.risk_index DESC
LIMIT 20;
```

### Result

- High-risk transactions: 84
- Highest observed risk score: 0.990

The verified analysis shows a strong association between high risk
scores and suspicious transaction activity.

---

## 6. Foreign Transaction Analysis

### Query

```cypher
MATCH (t:Transaction)
RETURN
    t.foreign_txn_flag AS foreign_transaction,
    t.fraud_label AS fraud_label,
    count(t) AS transaction_count
ORDER BY foreign_transaction, fraud_label;
```

### Verified Results

| Foreign Flag | Fraud Label | Count |
|---:|---|---:|
| 0 | normal | 2,000 |
| 0 | suspicious | 123 |
| 1 | suspicious | 27 |

### Finding

There are **27 suspicious foreign transactions** in the dataset.

Foreign transaction activity is therefore one of the observable
behavioral indicators available for fraud analysis.

---

## 7. Suspicious Transactions by Merchant

### Query

```cypher
MATCH (t:Transaction)-[:AT_MERCHANT]->(m:Merchant)
WHERE t.fraud_label = 'suspicious'
RETURN
    m.merchant_type AS merchant_type,
    count(t) AS suspicious_transactions
ORDER BY suspicious_transactions DESC;
```

### Verified Results

| Merchant Type | Suspicious Transactions |
|---|---:|
| Travel | 21 |
| Entertainment | 15 |
| Coffee Shop | 10 |
| Subscription | 9 |
| Gas Station | 9 |

### Finding

**Travel** has the highest number of suspicious transactions among the
merchant categories in the verified results, with **21 suspicious
transactions**.

---

## 8. Overall Merchant Distribution

### Query

```cypher
MATCH (t:Transaction)-[:AT_MERCHANT]->(m:Merchant)
RETURN
    m.merchant_type,
    count(t) AS txn_count
ORDER BY txn_count DESC
LIMIT 5;
```

### Verified Results

| Merchant Type | Total Transactions |
|---|---:|
| Subscription | 159 |
| Pharmacy | 153 |
| Grocery | 150 |
| Coffee Shop | 148 |
| Entertainment | 147 |

### Finding

Subscription has the highest overall transaction count among the
top five merchant categories, with 159 transactions.

This is different from suspicious-transaction concentration, where
Travel has the highest suspicious transaction count.

---

## 9. Transaction Frequency Analysis

### Query

```cypher
MATCH (t:Transaction)
RETURN
    t.txn_count_past_hour AS transactions_past_hour,
    t.fraud_label AS fraud_label,
    count(t) AS transaction_count
ORDER BY transactions_past_hour DESC;
```

### Verified Results

| Transactions in Past Hour | Fraud Label | Count |
|---:|---|---:|
| 12 | suspicious | 4 |
| 8 | suspicious | 7 |
| 5 | suspicious | 5 |
| 3 | suspicious | 24 |
| 2 | suspicious | 40 |
| 1 | suspicious | 59 |
| 1 | normal | 493 |
| 0 | normal | 1,406 |

### Finding

The verified results show that suspicious transactions occur across
different transaction-frequency levels. Recent transaction activity
provides a useful behavioral indicator that can be considered together
with risk score and fraud label.

The results also show that a transaction-frequency value by itself
should not be treated as sufficient evidence of fraud.

---

## 10. Account-Level Suspicious Analysis

The account-wise suspicious transaction query was executed on the
shared FingraphDB setup.

### Query

```cypher
MATCH (a:Account)-[:MADE]->(t:Transaction)
WHERE t.fraud_label = 'suspicious'
RETURN
    a.account_id AS account_id,
    count(t) AS suspicious_transactions,
    max(t.risk_index) AS highest_risk
ORDER BY suspicious_transactions DESC, highest_risk DESC
LIMIT 20;
```

### Result

| account_id | suspicious_transactions | highest_risk |
| :--- | :--- | :--- |
| ACC99997 | 1 | 0.990 |
| ACC39967 | 1 | 0.990 |
| ACC94487 | 1 | 0.989 |
| ACC58103 | 1 | 0.985 |
| ACC89618 | 1 | 0.984 |
| ACC11603 | 1 | 0.980 |
| ACC49394 | 1 | 0.980 |
| ACC41224 | 1 | 0.979 |
| ACC39459 | 1 | 0.977 |
| ACC33143 | 1 | 0.973 |
| ACC17550 | 1 | 0.973 |
| ACC24156 | 1 | 0.973 |
| ACC22759 | 1 | 0.972 |
| ACC45728 | 1 | 0.969 |
| ACC59722 | 1 | 0.966 |
| ACC98387 | 1 | 0.964 |
| ACC23639 | 1 | 0.963 |
| ACC93548 | 1 | 0.962 |
| ACC83505 | 1 | 0.960 |
| ACC29283 | 1 | 0.954 |

---

## 11. Key Findings

Based on the verified Neo4j analysis:

- **Total transactions:** 2,150
- **Suspicious transactions:** 150 (6.98% overall suspicious rate)
- **High-risk transactions ($\ge$ 0.658):** 84
- **Highest observed risk score:** 0.990 (across accounts such as `ACC99997` and `ACC39967`)
- **Foreign transactions:** 27 (100% flagged as suspicious)
- **Top suspicious merchant category:** Travel (21 suspicious transactions)
- **Top overall merchant category:** Subscription (159 total transactions)
- **Account concentration:** High-risk transactions are evenly distributed as single events across distinct accounts.
- **Velocity indicator:** Suspicious transactions span past-hour frequencies ranging from 1 to 12.

---

## 12. Analytics Observations

### Risk Score Correlation
Suspicious transactions show a direct correlation with elevated risk scores, peaking at 0.990 across the top 20 prioritized accounts.

### Foreign Transaction Flag
All 27 transactions with `foreign_txn_flag = 1` are classified as suspicious, making cross-border activity a critical high-precision indicator in this dataset.

### Merchant Patterns vs. Volume
Travel exhibits the highest fraud concentration (21 transactions), whereas Subscription drives the largest aggregate transaction volume (159 transactions). Fraud monitoring must isolate risk concentration from gross volume.

### Account-Level Distribution
The top suspicious accounts each recorded a single high-risk event (risk index 0.954–0.990), indicating scattered, single-attempt anomalies across unique accounts rather than repetitive multi-event attacks on a single entity.

### Transaction Velocity
While higher hourly frequencies (up to 12 txns/hr) correlate with suspicious labels, significant fraud volume also appears at lower frequencies (e.g., 59 suspicious transactions at 1 txn/hr), demonstrating that velocity must be evaluated alongside risk index and location signals.

---

## 13. Fraud Analytics Scope

The verified schema supports the 15 attributes mapped across `Account`, `Card`, `Transaction`, `Location`, and `Merchant` nodes.

* **Supported Features:** Amount, currency, channel, distance from home, foreign flag, past-hour velocity, risk index, and fraud labels.
* **Out of Scope (Requires Schema Expansion):** IP address tracking, device fingerprinting, and account-to-account circular fund routing (`TRANSFERRED_TO`).

---

## 14. Conclusion

The FingraphDB graph schema and fraud queries are fully verified in Neo4j. The validated baseline (2,120 accounts, 2,150 cards, 2,150 transactions, 19 locations, and 19 merchants) provides the verified foundation for downstream API integration and dashboard KPI visualization.

