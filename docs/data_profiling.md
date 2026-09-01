# FinGraph – Transaction Data Profiling

## 1. Dataset Overview

The transaction dataset contains 2,150 financial transactions with 15 attributes profiled for graph construction (shubhamgawari9226).

### Dataset Statistics

- Total transactions: 2,150
- Total columns: 15
- Missing values: 0
- Normal transactions: 2,000
- Suspicious transactions: 150
- Suspicious transaction rate: 6.98%

## 2. Dataset Columns

The dataset contains the following fields:

- txn_id
- txn_datetime
- customer_account
- card_no
- txn_amount
- txn_currency
- merchant_type
- city
- country_code
- payment_channel
- km_from_home
- foreign_txn_flag
- txn_count_past_hour
- fraud_label
- risk_index

## 3. Fraud Distribution

| Fraud Label | Count | Percentage |
|-------------|------:|-----------:|
| normal | 2,000 | 93.02% |
| suspicious | 150 | 6.98% |

## 4. Risk Index Analysis

Normal transactions have a mean risk index of 0.129, with values ranging from 0.010 to 0.250.

Suspicious transactions have a mean risk index of 0.823, with values ranging from 0.658 to 0.990.

In this dataset, the risk-index ranges for normal and suspicious transactions do not overlap.

## 5. Foreign Transaction Analysis

| Foreign Transaction | Normal | Suspicious |
|----------------------|-------:|-----------:|
| 0 | 2,000 | 123 |
| 1 | 0 | 27 |

All 27 transactions marked as foreign transactions are labeled suspicious in this dataset.

Therefore, `foreign_txn_flag` can be considered a strong fraud-detection indicator for this dataset.

## 6. Payment Channel Analysis

| Payment Channel | Normal | Suspicious |
|------------------|-------:|-----------:|
| ATM | 499 | 36 |
| Mobile App | 527 | 34 |
| Online | 511 | 50 |
| POS | 463 | 30 |

Online transactions have the highest suspicious rate among the available payment channels.

## 7. Merchant Type Analysis

Merchant categories with notable suspicious transactions include:

- Travel: 21
- Entertainment: 15
- Coffee Shop: 10
- Subscription: 9
- Gas Station: 9
- Electronics: 8
- Pharmacy: 8

The following categories contain only suspicious transactions in this dataset:

- Crypto Exchange: 4
- Gift Cards: 5
- Jewelry: 2
- Wire Transfer: 7

These observations should be treated as dataset-specific patterns and not as proof that a merchant category is inherently fraudulent.

## 8. Key Analytics Observations

The initial profiling identified the following important indicators:

1. `risk_index` strongly separates normal and suspicious transactions.
2. Foreign transactions are strongly associated with suspicious labels in this dataset.
3. Online payment transactions have the highest suspicious rate among payment channels.
4. Travel and Entertainment have relatively high suspicious transaction counts.
5. Crypto Exchange, Gift Cards, Jewelry, and Wire Transfer contain only suspicious transactions in this dataset.

## 9. Next Analytics Steps

Further analysis should investigate:

- Transaction amount patterns
- Transaction frequency
- `txn_count_past_hour`
- Distance from home
- Customer/account transaction behavior
- Relationships between accounts and transactions
- Potential fraud clusters
- Neo4j graph relationships
- Fraud detection thresholds and rules