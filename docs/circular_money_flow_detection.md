# FinGraph – Circular Money-Flow Detection

## 1. Objective

Implement and validate graph algorithmic detection of the required circular money-flow pattern (shubhamgawari9226):

**A → B → C → A**

The production dataset does not contain sender and receiver account fields. Therefore, the circular-flow logic was validated using a small **synthetic test graph** in Neo4j, as approved by the team lead.

## 2. Synthetic Test Data

The following test accounts were created:

* `TEST_A`
* `TEST_B`
* `TEST_C`
* `TEST_D`

The intentional circular flow is:

**TEST_A → TEST_B → TEST_C → TEST_A**

A separate relationship was also created:

**TEST_D → TEST_A**

This was used as a non-circular control relationship.

All four accounts and relationships were explicitly marked with:

`test_data: true`

## 3. Test Graph Creation

The synthetic graph was created using:

```cypher
CREATE
(a:Account {account_id: 'TEST_A'}),
(b:Account {account_id: 'TEST_B'}),
(c:Account {account_id: 'TEST_C'}),
(d:Account {account_id: 'TEST_D'}),

(a)-[:TRANSFERRED_TO {test_data: true}]->(b),
(b)-[:TRANSFERRED_TO {test_data: true}]->(c),
(c)-[:TRANSFERRED_TO {test_data: true}]->(a),
(d)-[:TRANSFERRED_TO {test_data: true}]->(a);
```

## 4. Circular-Flow Detection Query

```cypher
MATCH p = (a:Account)-[:TRANSFERRED_TO*3..3]->(a)
WHERE a.account_id STARTS WITH 'TEST'
RETURN p;
```

## 5. Expected Pattern

The query was designed to identify a three-transfer cycle:

**TEST_A → TEST_B → TEST_C → TEST_A**

## 6. Result

The query successfully detected:

* 3 Account nodes
* 3 `TRANSFERRED_TO` relationships
* A closed three-account cycle

The detected cycle confirms that the Cypher logic can identify the required circular money-flow pattern.

## 7. Scope

This implementation is a **synthetic test validation**.

The `TEST_*` accounts are not production customer accounts and are not part of `transactions_dataset_v2.csv`.

The result must therefore not be reported as a production fraud finding.

## 8. Status

**Circular money-flow detection: Completed and validated using synthetic test data.**
