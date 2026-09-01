# FinGraph – Transaction Dataset to Neo4j Graph Schema Mapping

## 1. Objective

The objective of this work was to establish a clear ETL graph mapping between the available transaction dataset and the FinGraph Neo4j graph schema (shubhamgawari9226).

This mapping identifies which dataset fields can be directly used for graph construction and fraud analytics, and documents the schema fields that are not currently available in the transaction dataset.

## 2. Source Dataset

Dataset: `transactions_dataset_v2.csv`

Dataset summary:

- Total transactions: 2,150
- Total columns: 15
- Normal transactions: 2,000
- Suspicious transactions: 150
- Missing values: 0

## 3. Dataset-to-Graph Mapping

| Dataset Field | Data Type | Graph / Analytics Usage |
|---|---|---|
| `txn_id` | String | Transaction identifier |
| `txn_datetime` | String | Transaction timestamp |
| `customer_account` | String | Account identifier |
| `card_no` | String | Card/transaction attribute |
| `txn_amount` | Float | Transaction amount |
| `txn_currency` | String | Transaction currency |
| `merchant_type` | String | Merchant analysis |
| `city` | String | Transaction location |
| `country_code` | String | Country information |
| `payment_channel` | String | Payment channel analysis |
| `km_from_home` | Float | Distance-based risk analysis |
| `foreign_txn_flag` | Integer | Foreign transaction indicator |
| `txn_count_past_hour` | Integer | Transaction frequency analysis |
| `fraud_label` | String | Fraud classification |
| `risk_index` | Float | Risk scoring and analysis |

## 4. Account Mapping

The `customer_account` field identifies the account associated with each transaction.

Mapping: `customer_account → Account.account_id`

The account identifier can be used to identify Account nodes during graph processing.

## 5. Transaction Mapping

The main transaction fields are:

- `txn_id` → `transaction_id`
- `txn_amount` → `amount`
- `txn_datetime` → `timestamp`

These fields can be associated with transaction relationships or transaction-level properties according to the approved Neo4j implementation.

## 6. Current Graph Relationship

The current FinGraph schema defines:

`(Account) ──TRANSFERRED_TO──> (Account)`

This relationship represents money movement between accounts.

### Dataset Limitation

The current transaction dataset contains `customer_account` but does not contain a separate destination-account field.

Therefore, a destination account for the `TRANSFERRED_TO` relationship cannot be derived directly from the current dataset without an additional source field or an approved transformation rule.

No destination-account values were invented during this mapping.

## 7. Current Graph Entities

The approved graph schema includes:

- Person
- Account
- Bank
- Device
- IPAddress

The transaction dataset can directly support the Account entity through `customer_account`.

However, the dataset does not currently provide direct fields for:

- `person_id`
- `name`
- `bank_id`
- `bank_name`
- `device_id`
- `ip_address`

These entities therefore require additional source information or an approved mapping strategy before they can be fully populated from this dataset.

## 8. Fraud Analysis Fields

### 8.1 Fraud Label

The `fraud_label` field classifies transactions as:

- Normal: 2,000
- Suspicious: 150

Total transactions: 2,150.

### 8.2 Risk Index

The `risk_index` field provides a transaction-level risk value.

Observed range: `0.01 – 0.99`

The risk index can be used for identifying and ranking high-risk transactions.

### 8.3 Foreign Transaction Flag

The `foreign_txn_flag` field indicates whether a transaction is foreign.

Values:

- `0` = Non-foreign transaction
- `1` = Foreign transaction

### 8.4 Transaction Frequency

The `txn_count_past_hour` field represents transaction activity within the previous hour.

This field can be used to identify unusually high transaction frequency and support fraud detection analysis.

### 8.5 Distance From Home

The `km_from_home` field represents the distance of the transaction from the customer's home location.

It can be used as a supporting attribute for transaction-risk analysis.

## 9. Additional Transaction Attributes

The following fields provide additional analytical context:

- `card_no`
- `txn_currency`
- `merchant_type`
- `city`
- `country_code`
- `payment_channel`

These attributes can be used for filtering, grouping, fraud analysis, and future dashboard requirements.

## 10. Dataset-to-Schema Availability

| Graph Requirement | Available in Dataset |
|---|---|
| Account identifier | Yes |
| Transaction identifier | Yes |
| Transaction amount | Yes |
| Transaction timestamp | Yes |
| Fraud label | Yes |
| Risk index | Yes |
| Foreign transaction indicator | Yes |
| Transaction frequency | Yes |
| Person ID | No |
| Bank ID | No |
| Device ID | No |
| IP address | No |
| Destination account | No |

## 11. Schema/Data Gaps Identified

The mapping identified the following gaps between the current graph schema and the available transaction dataset:

1. A separate destination-account field is not available for creating directed `TRANSFERRED_TO` relationships from the dataset.
2. Person information is not available.
3. Bank information is not available.
4. Device information is not available.
5. IP address information is not available.

These gaps should be addressed through additional source data or an approved data-generation/transformation strategy before attempting to populate the missing graph entities and relationships.

## 12. Graph Structure Reference

The current FinGraph graph structure is:

Person → OWNS → Account  
Account → HELD_AT → Bank  
Account → USES_DEVICE → Device  
Account → USES_IP → IPAddress  
Account → TRANSFERRED_TO → Account

The transaction dataset currently provides the strongest direct support for the Account and transaction-analysis portions of this structure.

## 13. Analytics Relevance

The dataset contains sufficient transaction-level information to perform important fraud analytics, including:

- Suspicious transaction identification
- Risk-based transaction analysis
- Foreign transaction analysis
- Merchant-wise suspicious transaction analysis
- Transaction-frequency analysis
- Distance-based risk analysis
- Payment-channel analysis

The mapping establishes a clear connection between the source transaction data and the FinGraph analytics requirements.

## 14. Conclusion

The transaction dataset contains 2,150 complete transaction records with no missing values and provides the core attributes required for transaction-level fraud analysis.

The `customer_account`, `txn_id`, `txn_amount`, and `txn_datetime` fields provide the primary information for account and transaction processing.

However, the current dataset does not contain destination-account, person, bank, device, or IP-address fields required to fully populate all entities and relationships in the current Neo4j schema.

This document serves as a reference for connecting the source transaction dataset with the FinGraph Neo4j schema while clearly documenting the current data limitations and preventing unsupported or fabricated graph relationships.