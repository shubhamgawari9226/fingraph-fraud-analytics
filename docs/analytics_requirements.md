# FinGraph - Analytics Requirements

## 1. Project Objective

FinGraph is a real-time fraud analytics platform designed to detect and analyze suspicious financial transaction networks using graph-based analytics.

The objective is to identify suspicious accounts, connected fraud networks, circular money flows, and high-risk transaction patterns.

## 2. Key Fraud Patterns

The analytics system should focus on identifying:

- Circular money flows
- Multiple accounts transferring money through intermediary accounts
- Starburst transaction patterns
- Suspicious clusters of connected accounts
- High-risk accounts
- Rapid movement of money between accounts
- Multiple accounts connected to common entities
- Unusual transaction relationships

## 3. Important Analytics Metrics

The dashboard should provide metrics such as:

- Total transactions
- Total transaction value
- Number of suspicious accounts
- Number of suspicious transactions
- Number of fraud clusters
- Number of high-risk accounts
- Number of connected accounts
- Number of detected circular money flows
- Average transaction amount
- Maximum transaction amount

## 4. Risk Analysis

Each suspicious account should be assigned a risk score based on factors such as:

- Number of suspicious connections
- Transaction frequency
- Transaction value
- Participation in circular transactions
- Membership in suspicious clusters
- Network centrality
- Number of connected accounts

## 5. Graph Analytics

The graph analytics should support:

- Community detection
- Connected component analysis
- PageRank / centrality analysis
- Detection of suspicious transaction paths
- Identification of highly connected accounts

## 6. Analyst Questions

The analytics solution should help an analyst answer:

1. Which accounts are highest risk?
2. Which accounts are connected to each other?
3. Which transactions form suspicious money flows?
4. Are there circular transaction paths?
5. Which groups of accounts form suspicious clusters?
6. Which accounts have unusually high transaction activity?
7. Which accounts are central to suspicious networks?
8. What are the largest suspicious transactions?

## 7. Dashboard Requirements

The dashboard should eventually provide:

- Overall fraud KPIs
- High-risk accounts
- Suspicious transaction networks
- Fraud clusters
- Transaction flow visualization
- Risk scores
- Interactive graph exploration
- Filtering by account, transaction, and risk level

## 8. Fraud Detection Thresholds

| Fraud Pattern | Threshold |
|---|---|
| Shared IP | More than 10 transactions within 5 minutes |
| Shared Device | More than 5 accounts using the same device |
| Micro-transactions | More than 20 transactions to one account |
| Circular Transfer | A → B → C → A |

## 9. Analytics Priority

### High Priority
- Circular transfer detection
- Shared IP detection
- Shared device detection

### Medium Priority
- Micro-transaction detection
- Suspicious cluster analysis

### Future Analysis
- Risk scoring
- Graph centrality
- Community detection