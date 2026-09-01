# FinGraph – Node Risk Score Analysis & Execution Report

## 1. Objective

The objective of this document is to define the graph data engineering methodology, query design, scoring logic, and verified execution results for calculating **node-level risk scores** in FinGraph (shubhamgawari9226).

This work addresses the **node risk score calculation component** of the official Week 2 Analytics Lead deliverable.

## 2. Risk Scoring Methodology

The node risk scoring model combines transaction velocity, risk index, foreign transaction activity, transaction value, and transaction volume into a single composite score from **0–100** for each `Account` node.

### Risk Weight Allocation

| Factor                           | Source Property / Graph Metric | Risk Threshold / Condition               | Point Weight |
| -------------------------------- | ------------------------------ | ---------------------------------------- | -----------: |
| **Transaction Velocity**         | `txn_count_past_hour`          | `> 10` transactions within 1 hour        |       25 pts |
| **Risk Index**                   | `risk_index`                   | Maximum risk index `≥ 0.70`              |       25 pts |
| **Foreign Transaction Activity** | `foreign_txn_flag`             | At least one foreign transaction (`= 1`) |       20 pts |
| **High Value Transaction**       | `txn_amount`                   | Maximum transaction amount `> 50,000`    |       15 pts |
| **Transaction Volume**           | Connected `MADE` transactions  | `> 5` total transactions linked          |       15 pts |

**Total Maximum Risk Score: 100 points**

## 3. Risk Tiers and Thresholds

Accounts are categorized based on their calculated score:

* **0–29 (LOW):** Normal baseline activity; standard monitoring.
* **30–59 (MEDIUM):** Elevated anomalous indicators; flagged for periodic review.
* **60–79 (HIGH):** Multiple high-risk indicators; prioritized for analyst inspection.
* **80–100 (CRITICAL):** Multiple strong risk indicators; prioritized for immediate review.

## 4. Implemented Cypher Query

The following Cypher query aggregates transaction properties, calculates an account-level risk score, and updates the `Account` nodes with `risk_score` and `risk_tier`.

```cypher
MATCH (a:Account)-[:MADE]->(t:Transaction)
WITH a,
     count(t) AS total_txns,
     max(t.risk_index) AS max_risk_index,
     max(t.txn_count_past_hour) AS max_velocity,
     max(t.foreign_txn_flag) AS has_foreign_txn,
     max(t.txn_amount) AS max_amount
WITH a,
     total_txns,
     (CASE WHEN max_velocity > 10 THEN 25 ELSE 0 END) AS velocity_score,
     (CASE WHEN max_risk_index >= 0.70 THEN 25 ELSE 0 END) AS risk_index_score,
     (CASE WHEN has_foreign_txn = 1 THEN 20 ELSE 0 END) AS foreign_score,
     (CASE WHEN max_amount > 50000 THEN 15 ELSE 0 END) AS amount_score,
     (CASE WHEN total_txns > 5 THEN 15 ELSE 0 END) AS volume_score
WITH a,
     (velocity_score + risk_index_score + foreign_score + amount_score + volume_score) AS calculated_risk_score
SET a.risk_score = calculated_risk_score,
    a.risk_tier = CASE
        WHEN calculated_risk_score >= 80 THEN "CRITICAL"
        WHEN calculated_risk_score >= 60 THEN "HIGH"
        WHEN calculated_risk_score >= 30 THEN "MEDIUM"
        ELSE "LOW"
    END
RETURN
    a.account_id AS account_id,
    a.risk_score AS risk_score,
    a.risk_tier AS risk_tier
ORDER BY risk_score DESC;
```

## 5. Scoring Logic

The query uses the following account-level indicators:

1. **Transaction Velocity**
   If the maximum `txn_count_past_hour` is greater than 10, the account receives 25 points.

2. **Risk Index**
   If the maximum `risk_index` is at least 0.70, the account receives 25 points.

3. **Foreign Transaction Activity**
   If the account has at least one transaction with `foreign_txn_flag = 1`, it receives 20 points.

4. **High Value Transaction**
   If the maximum transaction amount is greater than 50,000, the account receives 15 points.

5. **Transaction Volume**
   If the account has more than 5 transactions connected through `MADE`, it receives 15 points.

The individual points are added to produce the final account-level risk score.

## 6. Account Processing

The query processes accounts that have at least one `MADE` relationship to a `Transaction` node.

The previously verified execution processed:

* **Accounts with transactions:** 2,120
* **Risk properties updated:** 4,240
* **Properties per processed account:** 2

  * `risk_score`
  * `risk_tier`

The difference between the total Account node count and the processed account count can occur because the query only considers accounts connected to transactions through `MADE`.

## 7. Verified Database Execution Results

The risk-scoring query was previously verified on the shared Neo4j/FingraphDB environment.

### Execution Metrics

* **Accounts processed:** 2,120
* **Properties updated:** 4,240
* **Initial record streaming time:** approximately 62 ms

### Sample Output

| Account ID | Risk Score | Risk Tier |
| ---------- | ---------: | --------- |
| `ACC95357` |         50 | MEDIUM    |
| `ACC74177` |         50 | MEDIUM    |
| `ACC77922` |         50 | MEDIUM    |
| `ACC99142` |         25 | LOW       |
| `ACC59105` |         25 | LOW       |
| `ACC84099` |         25 | LOW       |
| `ACC21050` |         25 | LOW       |
| `ACC76156` |         25 | LOW       |
| `ACC36092` |         25 | LOW       |
| `ACC97743` |         25 | LOW       |

## 8. Risk-Scoring Model Limitation

The scoring model uses maximum transaction-level values for several indicators:

* `max(risk_index)`
* `max(txn_count_past_hour)`
* `max(foreign_txn_flag)`
* `max(txn_amount)`

Therefore, a single transaction can activate the corresponding risk component for an account.

For example, one foreign transaction is sufficient to assign the 20-point foreign-activity component.

This is a **rule-based screening model** and should not be interpreted as a statistical or machine-learning fraud probability.

## 9. High-Value Transaction Threshold

The high-value transaction component uses:

```text
txn_amount > 50,000
```

This threshold contributes 15 points when an account has at least one transaction above the threshold.

The actual number of transactions exceeding this threshold should be verified against the current database before drawing conclusions about the contribution of this factor.

## 10. Analytics Interpretation

The resulting `risk_score` provides a simple account-level risk indicator based on multiple transaction signals.

The `risk_tier` provides an easier classification for downstream analytics and dashboard visualization.

The score should be used as a **screening indicator** rather than as a final fraud determination.

## 11. Conclusion

The account-level risk scoring implementation was successfully designed and previously verified on the shared Neo4j/FingraphDB environment.

The implementation:

* Calculates a composite score from 0–100.
* Assigns LOW, MEDIUM, HIGH, or CRITICAL risk tiers.
* Updates `risk_score` and `risk_tier` properties on Account nodes.
* Processes accounts connected to transactions.
* Combines multiple transaction-level indicators instead of relying on a single signal.

This completes the **node risk score calculation component** of the Week 2 Analytics Lead deliverable.


