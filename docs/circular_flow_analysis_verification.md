# FinGraph – Circular-Flow Analysis & Verification

## 1. Objective

Verify the circular money-flow detection logic against the approved synthetic Neo4j test graph.

## 2. Test Scenario

The test graph contains the following intentional circular flow:

**TEST_A → TEST_B → TEST_C → TEST_A**

An additional non-circular relationship was created:

**TEST_D → TEST_A**

The test data was explicitly marked using:

`test_data: true`

## 3. Verification Query

```cypher
MATCH p = (a:Account)-[:TRANSFERRED_TO*3..3]->(a)
WHERE a.account_id STARTS WITH 'TEST'
RETURN a.account_id AS start_account,
       [n IN nodes(p) | n.account_id] AS flow,
       length(p) AS path_length;
```

## 4. Verified Output

The query returned three representations of the same circular flow:

| Start Account | Flow                              | Path Length |
| ------------- | --------------------------------- | ----------: |
| TEST_A        | TEST_A → TEST_B → TEST_C → TEST_A |           3 |
| TEST_B        | TEST_B → TEST_C → TEST_A → TEST_B |           3 |
| TEST_C        | TEST_C → TEST_A → TEST_B → TEST_C |           3 |

## 5. Analysis

The three returned records represent the same three-account cycle from different starting points.

The important verification result is:

**3 distinct accounts → 3 directed transfers → closed cycle**

The non-circular `TEST_D → TEST_A` relationship did not form part of the detected three-transfer cycle.

## 6. Verification Conclusion

The circular-flow Cypher logic successfully detected the intended:

**A → B → C → A**

pattern in the synthetic test graph.

This confirms that the query logic is technically functional.

## 7. Production Data Limitation

The current production transaction dataset does not contain separate:

* `sender_account`
* `receiver_account`

fields.

Therefore, the circular-flow detection cannot currently be verified against real transaction flows.

The current result is strictly a **synthetic test validation**, as approved by the team lead.

## 8. Status

* Synthetic test graph: **Completed**
* Circular-flow query: **Executed successfully**
* Circular-flow verification: **Completed**
* Production circular-flow verification: **Pending suitable directional transfer data**
