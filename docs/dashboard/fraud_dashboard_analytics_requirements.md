# FinGraph – Fraud Dashboard Analytics Requirements

## 1. Objective

The objective of this document is to define the verified fraud analytics metrics, dashboard requirements, and API outputs that can be used for the FinGraph fraud analytics dashboard.

The analytics are based on the currently verified Neo4j graph database results.

---

## 2. Verified Dashboard KPIs

| KPI | Verified Value |
|---|---:|
| Total Accounts | 2,124 |
| Total Transactions | 2,150 |
| Total Cards | 2,150 |
| Total Locations | 19 |
| Total Merchants | 19 |
| Suspicious Transactions | 150 |
| Normal Transactions | 2,000 |
| Suspicious Transaction Rate | 6.98% |
| Suspicious Foreign Transactions | 27 |
| Accounts with Risk Score | 2,120 |
| Maximum Account Risk Score | 50 |

These values were verified directly from the current Neo4j database.

---

## 3. Risk Distribution

The current Account risk-score distribution is:

| Risk Tier | Account Count |
|---|---:|
| LOW | 2,117 |
| MEDIUM | 3 |
| HIGH | 0 |
| CRITICAL | 0 |

The current maximum account risk score is 50, which falls under the MEDIUM risk tier.

The dashboard should display the risk distribution using KPI cards or a suitable chart.

---

## 4. Top-Risk Accounts

The dashboard should provide a table of the highest-risk accounts.

Required fields:

- account_id
- risk_score
- risk_tier

Currently verified highest-risk accounts include:

| Account ID | Risk Score | Risk Tier |
|---|---:|---|
| ACC74177 | 50 | MEDIUM |
| ACC77922 | 50 | MEDIUM |
| ACC95357 | 50 | MEDIUM |

The dashboard should retrieve this information dynamically from Neo4j rather than hard-coding the current values.

---

## 5. Suspicious Merchant Analysis

The dashboard should display suspicious transactions grouped by merchant category.

Verified results:

| Merchant Type | Suspicious Transactions |
|---|---:|
| Travel | 21 |
| Entertainment | 15 |
| Coffee Shop | 10 |
| Gas Station | 9 |
| Subscription | 9 |
| Electronics | 8 |
| Grocery | 8 |
| Insurance | 8 |
| Pharmacy | 8 |
| Home Improvement | 7 |
| Retail | 7 |
| Wire Transfer | 7 |
| Healthcare | 6 |
| Restaurant | 6 |
| Utilities | 6 |
| Gift Cards | 5 |
| Crypto Exchange | 4 |
| Education | 4 |
| Jewelry | 2 |

### Key Observation

Travel has the highest number of suspicious transactions, with 21 suspicious transactions.

---

## 6. Overall Merchant Transaction Volume

The dashboard should separately display overall transaction volume by merchant category.

Top verified results:

| Merchant Type | Total Transactions |
|---|---:|
| Subscription | 159 |
| Pharmacy | 153 |
| Grocery | 150 |
| Coffee Shop | 148 |
| Travel | 147 |
| Entertainment | 147 |
| Electronics | 146 |
| Retail | 143 |
| Insurance | 137 |
| Gas Station | 136 |

### Important Analytical Observation

Overall transaction volume and suspicious transaction concentration should be treated as separate analytics.

For example:

- Subscription has the highest overall transaction volume: 159.
- Travel has the highest suspicious transaction count: 21.

Therefore, high transaction volume does not automatically indicate high fraud concentration.

---

## 7. Foreign Transaction Analysis

The dashboard should provide foreign transaction analysis using:

- foreign_txn_flag
- fraud_label
- transaction_count

Verified results:

| Foreign Transaction | Fraud Label | Count |
|---|---|---:|
| FALSE | normal | 2,000 |
| FALSE | suspicious | 123 |
| TRUE | suspicious | 27 |

### Key Dashboard Metric

Suspicious foreign transactions: 27.

Foreign transaction status should be treated as one supporting fraud indicator rather than standalone proof of fraud.

---

## 8. Transaction-Frequency Analysis

The dashboard should analyze transaction activity using:

`txn_count_past_hour`

Verified results include:

| Transactions in Past Hour | Fraud Label | Count |
|---:|---|---:|
| 12 | suspicious | 4 |
| 11 | suspicious | 1 |
| 10 | suspicious | 2 |
| 9 | suspicious | 2 |
| 8 | suspicious | 7 |
| 7 | suspicious | 3 |
| 6 | suspicious | 3 |
| 5 | suspicious | 5 |
| 3 | suspicious | 24 |
| 2 | normal | 101 |
| 2 | suspicious | 40 |
| 1 | normal | 493 |
| 1 | suspicious | 59 |
| 0 | normal | 1,406 |

### Key Observation

The highest observed transaction frequency is 12 transactions within the past hour, and those transactions are labelled suspicious.

However, transaction frequency alone should not be treated as sufficient evidence of fraud.

---

## 9. Circular Money-Flow Detection

The dashboard should eventually support visualization of suspicious account-to-account money flows.

The current circular-flow Cypher logic was successfully validated using a small synthetic/test graph.

Verified test flow:

TEST_A → TEST_B → TEST_C → TEST_A

The query detected the same cycle from three different starting points:

- TEST_A → TEST_B → TEST_C → TEST_A
- TEST_B → TEST_C → TEST_A → TEST_B
- TEST_C → TEST_A → TEST_B → TEST_C

This represents:

- Unique circular cycle: 1
- Cycle length: 3
- Test accounts involved: 3

### Important Data Classification

The circular flow is SYNTHETIC/TEST DATA.

It was created only to validate the circular-flow Cypher query because the current transaction dataset does not contain destination-account information.

It must not be presented as a real production fraud case.

---

## 10. Suggested Dashboard Layout

### Section 1 – Fraud KPIs

Display:

- Total Transactions
- Suspicious Transactions
- Suspicious Rate
- Suspicious Foreign Transactions

### Section 2 – Risk Overview

Display:

- LOW accounts
- MEDIUM accounts
- HIGH accounts
- CRITICAL accounts
- Maximum Risk Score
- Top-Risk Accounts

### Section 3 – Merchant Analytics

Display:

- Suspicious Transactions by Merchant
- Overall Transaction Volume by Merchant

### Section 4 – Transaction Behavior

Display:

- Transaction Frequency
- Foreign Transaction Analysis
- Fraud Label Distribution

### Section 5 – Fraud Network

Display:

- Account-to-account relationships
- Circular money-flow detection
- Suspicious network paths

Circular-flow results should be clearly labelled as synthetic/test data until real destination-account data becomes available.

---

## 11. FastAPI Requirements

The backend API should provide structured outputs that can be consumed by the dashboard.

Suggested output sections:

- summary
- risk_distribution
- top_risk_accounts
- suspicious_merchants
- merchant_transaction_volume
- transaction_frequency
- foreign_transactions
- circular_flows

Suggested summary response structure:

{
  "summary": {
    "total_accounts": 2124,
    "total_transactions": 2150,
    "suspicious_transactions": 150,
    "suspicious_rate": 6.98,
    "suspicious_foreign_transactions": 27
  },
  "risk_distribution": {
    "low": 2117,
    "medium": 3,
    "high": 0,
    "critical": 0,
    "max_risk_score": 50
  }
}

Suggested circular-flow response:

{
  "test_data": true,
  "cycles": [
    {
      "flow": [
        "TEST_A",
        "TEST_B",
        "TEST_C",
        "TEST_A"
      ],
      "path_length": 3
    }
  ]
}

---

## 12. Data Limitations

The current transaction dataset does not contain a separate destination-account field.

Therefore, real production circular money-flow detection cannot currently be performed from the transaction dataset alone.

The current circular-flow test graph was created only for Cypher validation.

The dataset also does not directly provide:

- person_id
- bank_id
- device_id
- ip_address
- destination_account

These limitations should be communicated to the backend and frontend teams.

---

## 13. Dynamic Data Requirement

The current values in this document are verified snapshots from the Neo4j database.

The production dashboard should query the backend/Neo4j dynamically rather than hard-code these values.

When the underlying transaction data changes, the dashboard metrics should update accordingly.

---

## 14. Conclusion

The verified Neo4j analytics provide the foundation for the FinGraph fraud dashboard.

The current analytics support:

- Fraud KPI monitoring
- Suspicious transaction analysis
- Account-level risk scoring
- Risk-tier distribution
- Merchant analysis
- Foreign transaction analysis
- Transaction-frequency analysis
- Circular money-flow detection

These analytics can be exposed through FastAPI and visualized in the dashboard.

The current dataset limitations, especially the absence of destination-account information, should be clearly reflected in the implementation.

The circular-flow result should remain explicitly classified as synthetic/test data until real transaction relationship data is available.