# FinGraph – Analytics Readiness

## 1. Purpose

This document summarizes the current graph analytics readiness of the FinGraph data pipeline (shubhamgawari9226).

The objective is to establish a documented foundation for further fraud detection and graph-based analytics.

## 2. Source Dataset

Dataset: `transactions_dataset_v2.csv`

Current dataset summary:

- Total transactions: 2,150
- Normal transactions: 2,000
- Suspicious transactions: 150
- Total columns: 15
- Missing values: 0

The dataset contains transaction, account, merchant, location, payment-channel, frequency, fraud-label, and risk-related information.

## 3. Current Graph Model

The FinGraph Neo4j model represents financial entities and their relationships.

### Nodes

- Person
- Account
- Bank
- Device
- IPAddress

### Relationships

- `OWNS` — Person → Account
- `HELD_AT` — Account → Bank
- `TRANSFERRED_TO` — Account → Account
- `USES_DEVICE` — Account → Device
- `USES_IP` — Account → IPAddress

The `TRANSFERRED_TO` relationship represents money movement between accounts and contains transaction-related properties.

## 4. Dataset-to-Graph Readiness

The transaction dataset provides the following fields for analytics and graph integration:

| Dataset Field | Analytics / Graph Usage |
|---|---|
| `txn_id` | Transaction identifier |
| `txn_datetime` | Transaction timestamp |
| `customer_account` | Account identification |
| `card_no` | Card/transaction attribute |
| `txn_amount` | Transaction amount analysis |
| `txn_currency` | Currency analysis |
| `merchant_type` | Merchant analysis |
| `city` | Location analysis |
| `country_code` | Country analysis |
| `payment_channel` | Payment-channel analysis |
| `km_from_home` | Distance-based risk analysis |
| `foreign_txn_flag` | Foreign transaction analysis |
| `txn_count_past_hour` | Transaction-frequency analysis |
| `fraud_label` | Fraud classification |
| `risk_index` | Risk scoring |

## 5. Account Mapping

The `customer_account` field can be mapped to the Neo4j Account node.

`customer_account → Account.account_id`

This provides the primary connection between transaction-level data and account-level graph analytics.

## 6. Verified Fraud Analytics

The Neo4j/FingraphDB verification produced the following results:

- Total transactions: 2,150
- Suspicious transactions: 150
- High-risk transactions: 84
- Fraud rate: 6.98%
- Foreign suspicious transactions: 27
- Top merchant category: Travel

The verification also showed that high transaction frequency strongly correlates with suspicious activity.

## 7. Fraud Patterns Supported

The current analytics foundation supports investigation of the following patterns:

1. High transaction frequency within a short period.
2. Multiple accounts associated with the same device.
3. Micro-transaction activity.
4. Circular transfer patterns between accounts.
5. Suspicious foreign transactions.
6. Merchant-wise suspicious activity.
7. Account-wise suspicious activity.
8. High-risk transactions based on transaction attributes.

## 8. Analytics Areas

The current dataset and graph structure can support:

- Transaction-level fraud analysis
- Account-level risk analysis
- Merchant analysis
- Foreign transaction analysis
- Transaction-frequency analysis
- Risk-index analysis
- Suspicious transaction analysis
- Connected-account investigation
- Device-based relationship analysis
- IP-based relationship analysis
- Money-transfer network analysis

## 9. Current Analytics Findings

Based on the verified analysis:

- 150 out of 2,150 transactions were classified as suspicious.
- 84 transactions were identified as high-risk.
- The calculated suspicious/fraud rate was 6.98%.
- 27 suspicious transactions were identified as foreign transactions.
- Travel was the top merchant category in the verified merchant analysis.
- High transaction frequency showed a strong relationship with suspicious activity.

These findings provide initial indicators for further graph-based fraud investigation.

## 10. Schema Constraints

The Neo4j schema includes uniqueness constraints for important identifiers:

- `Person.person_id`
- `Account.account_id`
- `Bank.bank_id`
- `Device.device_id`
- `IPAddress.ip_address`

These constraints help prevent duplicate entity identifiers during graph construction.

## 11. Data Quality Status

The available transaction dataset currently has no missing values according to the completed profiling.

The dataset contains the required fields for transaction-level fraud analytics.

The mapping documentation also identifies the difference between fields directly available in the transaction dataset and entities represented in the broader Neo4j graph schema.

## 12. Current Limitations

The available transaction dataset does not directly provide all properties required by the complete conceptual graph model.

For example:

- Person information is not fully represented in the transaction dataset.
- Bank information is not directly available.
- Device identifiers are not directly available.
- IP address information is not directly available.
- Explicit source and destination account relationships are not represented by separate transaction columns in the dataset.

Therefore, these graph entities and relationships may require additional data sources or integration logic for complete graph construction.

## 13. Analytics Readiness Assessment

The current project is ready for further fraud analytics development because:

- The transaction dataset has been profiled.
- The Neo4j graph schema has been documented.
- Schema constraints have been defined.
- Dataset-to-graph mapping has been documented.
- Fraud detection thresholds have been documented.
- Fraud-analysis queries have been verified.
- Initial suspicious and high-risk transaction findings have been documented.

The existing foundation can therefore be used for more advanced graph-based fraud detection and analysis.

## 14. Next Analytics Direction

The next stage can build upon this foundation by developing more advanced Cypher-based fraud detection and graph analytics.

Potential areas include:

- Circular money-flow detection
- Connected account analysis
- Suspicious account networks
- Device and IP relationship analysis
- Risk scoring
- Fraud-syndicate identification
- Graph-based investigation queries
- Advanced Neo4j analytics

These areas should be developed using the verified schema, dataset mapping, and fraud-analysis requirements already documented in the project.

## 15. Conclusion

The FinGraph analytics foundation is now documented from the transaction dataset through the Neo4j graph model.

The completed work establishes a consistent relationship between transaction data, graph entities, fraud indicators, and analytics requirements. The verified results provide an initial understanding of suspicious transaction behavior and identify high-frequency activity, foreign transactions, merchant patterns, and high-risk transactions as important areas for further investigation.

This documentation provides a clear baseline for continuing the FinGraph fraud analytics implementation.