# FinGraph – Circular Money Flow Implementation Analysis

## 1. Objective

The objective of this work is to assess the graph pipeline implementation readiness of the required circular money-flow detection pattern (shubhamgawari9226):

A → B → C → A

The analysis compares the project requirement with the fields currently available in `transactions_dataset_v2.csv` and the implemented Neo4j graph schema.

---

## 2. Required Fraud Pattern

The project requirement specifies detection of a circular money-flow pattern:

A → B → C → A

This requires identifying three distinct accounts where:

- Account A transfers to Account B.
- Account B transfers to Account C.
- Account C transfers back to Account A.

The graph must therefore contain directional information about the source and destination accounts.

---

## 3. Available Transaction Dataset

Dataset:

`transactions_dataset_v2.csv`

Available account-related field:

- `customer_account`

This field identifies the customer account associated with a transaction.

Other relevant transaction fields include:

- `txn_id`
- `txn_datetime`
- `txn_amount`
- `txn_currency`
- `fraud_label`
- `risk_index`
- `foreign_txn_flag`
- `txn_count_past_hour`

---

## 4. Required Account-Transfer Fields

To directly implement the circular-flow pattern, the dataset would need directional account information such as:

- `sender_account`
- `receiver_account`

These fields would allow the graph to represent:

A → B

B → C

C → A

---

## 5. Current Data Limitation

The current `transactions_dataset_v2.csv` does not contain:

- `sender_account`
- `receiver_account`
- `source_account`
- `destination_account`

Therefore, the current dataset does not provide sufficient information to directly determine which account sent money to another account.

The existing `customer_account` field identifies the account associated with a transaction but does not establish a transfer direction between two different accounts.

---

## 6. Current Neo4j Graph Schema

The current Neo4j schema contains the following nodes:

- Account
- Card
- Transaction
- Merchant
- Location

The documented relationships are:

- Account → USES_CARD → Card
- Account → MADE → Transaction
- Transaction → OCCURRED_IN → Location
- Transaction → AT_MERCHANT → Merchant

The current schema does not contain a documented sender-to-receiver transfer relationship between accounts.

---

## 7. Circular Flow Query Readiness

The required A → B → C → A query cannot be executed correctly against the current dataset and documented graph structure.

A query such as:

MATCH (a:Account)-[:TRANSFERRED_TO]->(b:Account)
      -[:TRANSFERRED_TO]->(c:Account)
      -[:TRANSFERRED_TO]->(a:Account)
WHERE a <> b
  AND b <> c
  AND c <> a
RETURN
    a.account_id AS account_a,
    b.account_id AS account_b,
    c.account_id AS account_c;

requires a directional `TRANSFERRED_TO` relationship between Account nodes.

That relationship cannot be reliably created from the current transaction dataset because sender and receiver account fields are unavailable.

---

## 8. Why the Query Should Not Be Marked as Verified

The circular-flow query should not be reported as successfully executed or verified using the current dataset.

Doing so would require assuming sender and receiver information that is not present in the source data.

The correct status is:

Circular-flow detection: Not directly executable with the current dataset.

---

## 9. Data Requirement for Future Implementation

To implement the required circular money-flow detection, the project would need a dataset or additional fields containing directional transfer information.

Minimum required fields:

- `sender_account`
- `receiver_account`
- `txn_id`
- `txn_datetime`
- `txn_amount`

Additional useful fields may include:

- `txn_currency`
- `fraud_label`
- `risk_index`

With sender and receiver information available, account-to-account transfer relationships can be constructed in Neo4j.

---

## 10. Expected Graph Structure After Data Availability

With directional transfer data, the graph could represent:

Account A
    |
    | TRANSFERRED_TO
    ↓
Account B
    |
    | TRANSFERRED_TO
    ↓
Account C
    |
    | TRANSFERRED_TO
    ↓
Account A

This would allow the A → B → C → A pattern to be detected using Cypher.

---

## 11. Verification Plan

After appropriate sender and receiver data becomes available:

1. Import the required directional transfer information.
2. Create Account-to-Account transfer relationships.
3. Execute the circular-flow Cypher query.
4. Confirm that A, B, and C are distinct accounts.
5. Verify that the relationship direction forms A → B → C → A.
6. Check for duplicate representations of the same cycle.
7. Record the verified results for fraud-analysis documentation.

---

## 12. Current Status

Circular money-flow implementation has been analyzed against the available dataset and Neo4j schema.

Status:

- Requirement identified: Completed
- Dataset structure reviewed: Completed
- Schema reviewed: Completed
- Data limitation identified: Completed
- Circular-flow query design reviewed: Completed
- Actual circular-flow execution: Blocked by missing directional account fields
- Verification: Pending suitable transfer-direction data

---

## 13. Conclusion

The current FinGraph transaction dataset supports transaction-level fraud analytics but does not provide the sender and receiver account information required to directly detect the A → B → C → A circular money-flow pattern.

The implementation gap has been identified and documented.

The circular-flow detection can be implemented once directional account-transfer information becomes available through an updated dataset, additional fields, or an approved project data source.