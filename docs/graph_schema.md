# FinGraph – Neo4j Graph Schema

## 1. Project Purpose

FinGraph is a real-time fraud syndicate analytics project powered by Neo4j graph data engineering (shubhamgawari9226).

The Neo4j graph represents customer accounts, cards, transactions,
merchants, and transaction locations as connected data.

The schema is designed according to the fields available in
`transactions_dataset_v2.csv`.

---

## 2. Nodes

### Account

Represents a customer bank account involved in transactions.

Properties:

- account_id

Source field:

- `customer_account`

---

### Card

Represents a card associated with an account.

Properties:

- card_no

Source field:

- `card_no`

---

### Transaction

Represents an individual financial transaction.

Properties:

- txn_id
- txn_datetime
- txn_amount
- txn_currency
- payment_channel
- km_from_home
- foreign_txn_flag
- txn_count_past_hour
- fraud_label
- risk_index

Source fields:

- `txn_id`
- `txn_datetime`
- `txn_amount`
- `txn_currency`
- `payment_channel`
- `km_from_home`
- `foreign_txn_flag`
- `txn_count_past_hour`
- `fraud_label`
- `risk_index`

---

### Merchant

Represents the merchant category associated with a transaction.

Properties:

- merchant_type

Source field:

- `merchant_type`

---

### Location

Represents the location where a transaction occurred.

Properties:

- city
- country_code

Source fields:

- `city`
- `country_code`

---

## 3. Relationships

### USES_CARD

Account → Card

Represents the card associated with an account.

---

### MADE

Account → Transaction

Represents a transaction made by an account.

---

### OCCURRED_IN

Transaction → Location

Represents the location associated with a transaction.

---

### AT_MERCHANT

Transaction → Merchant

Represents the merchant category associated with a transaction.

---

## 4. Basic Graph Structure

Account → USES_CARD → Card

Account → MADE → Transaction

Transaction → OCCURRED_IN → Location

Transaction → AT_MERCHANT → Merchant

---

## 5. Fraud Analysis Support

The graph and transaction properties support analysis of:

1. High transaction frequency using `txn_count_past_hour`.
2. High-risk transactions using `risk_index`.
3. Foreign transaction patterns using `foreign_txn_flag`.
4. Suspicious transaction identification using `fraud_label`.
5. High-value transaction analysis using `txn_amount`.
6. Transaction behavior by payment channel.
7. Transaction behavior by merchant type.
8. Transaction behavior by location.

---

## 6. Dataset Limitations

The current `transactions_dataset_v2.csv` does not contain:

- person_id
- bank_id
- device_id
- ip_address
- sender_account
- receiver_account

Therefore, the following original fraud patterns cannot be directly implemented from this dataset:

1. More than 10 transactions from the same IP within 5 minutes.
2. More than 5 accounts using the same device.
3. Circular transfer pattern A → B → C → A.

These patterns require additional fields or a different dataset.

The available transaction frequency, foreign transaction flag,
risk index, transaction amount, and fraud label can instead be
used for the current dataset's fraud analytics.