# FinGraph – Circular Flow Testing Plan

## 1. Objective

The objective of this document is to define the graph algorithm testing and verification plan for the required circular money-flow detection pattern (shubhamgawari9226):

A → B → C → A

The plan will be used to verify the Cypher query once the approved Neo4j database access and required transfer-direction data are available.

---

## 2. Background

The FinGraph project requires graph-based fraud analysis, including detection of circular money flows.

The required pattern is:

A → B → C → A

This represents a sequence where:

- Account A transfers to Account B.
- Account B transfers to Account C.
- Account C transfers back to Account A.

The circular pattern can be used as a potentially suspicious graph indicator.

---

## 3. Current Dataset Limitation

The current `transactions_dataset_v2.csv` contains:

- `customer_account`
- `txn_id`
- `txn_datetime`
- `txn_amount`
- `txn_currency`
- `fraud_label`
- `risk_index`
- `foreign_txn_flag`
- `txn_count_past_hour`
- Other transaction attributes

However, the current dataset does not contain:

- `sender_account`
- `receiver_account`
- `source_account`
- `destination_account`

Therefore, the current dataset cannot directly establish directional account-to-account transfers.

---

## 4. Required Graph Structure

For circular-flow testing, the Neo4j graph must contain directional transfer relationships between accounts.

Expected structure:

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

This structure represents:

A → B → C → A

---

## 5. Circular Flow Cypher Query

Once the required `TRANSFERRED_TO` relationships are available, the following query can be used:

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

The query identifies three distinct accounts forming a directed circular path.

---

## 6. Test Case

### Test Case: Three-Account Circular Flow

Expected test structure:

A → B
B → C
C → A

Expected result:

The query should return:

- Account A
- Account B
- Account C

The returned accounts must represent a valid three-step directed cycle.

---

## 7. Negative Test Case

A valid circular flow should not be detected when the final transfer does not return to the starting account.

Example:

A → B
B → C
C → D

Expected result:

No A → B → C → A cycle should be returned.

This test helps verify that the query checks the complete circular relationship.

---

## 8. Distinct Account Validation

The query must ensure that the three participating accounts are different.

Required conditions:

a <> b

b <> c

c <> a

This prevents self-referencing or invalid repeated-node patterns from being treated as three-account circular flows.

---

## 9. Duplicate Cycle Validation

The same cycle may appear from different starting points.

For example:

A → B → C → A

B → C → A → B

C → A → B → C

These represent the same underlying three-account cycle.

After the initial query is verified, duplicate-cycle handling should be tested and refined if required by the project schema.

---

## 10. Verification Checklist

After approved Neo4j access and suitable transfer-direction data are available:

- Confirm connection to the correct FingraphDB environment.
- Confirm Account nodes exist.
- Confirm `TRANSFERRED_TO` relationships exist.
- Execute the circular-flow query.
- Confirm A, B, and C are distinct.
- Confirm transfer direction is correct.
- Verify that the final transfer returns to the starting account.
- Test a non-circular path.
- Check for duplicate cycle representations.
- Record the actual query output.
- Document verified findings.

---

## 11. Expected Output

The final verification output should contain information such as:

- `account_a`
- `account_b`
- `account_c`

Additional transaction information can be included if it is available in the approved Neo4j graph, such as:

- Transaction ID
- Transaction amount
- Transaction timestamp
- Currency
- Risk information

Actual output will be added after successful Neo4j execution.

---

## 12. Database Access Dependency

Actual execution of the circular-flow query depends on access to the approved shared Neo4j/FingraphDB environment.

The team lead has indicated that the required access/data confirmation will be provided after their current campus placement activities.

Therefore, the current document defines the testing approach without claiming that the production circular-flow query has already been verified.

---

## 13. Current Status

- Circular-flow requirement: Identified
- Existing dataset reviewed: Completed
- Dataset limitation identified: Completed
- Circular-flow query designed: Completed
- Testing methodology documented: Completed
- Neo4j execution: Pending approved access/data
- Actual circular-flow results: Pending
- Final verification: Pending

---

## 14. Next Steps

1. Receive confirmation from the team regarding the approved Neo4j environment or updated transfer dataset.
2. Connect to the shared FingraphDB environment.
3. Verify the available Account nodes and transfer relationships.
4. Execute the circular-flow Cypher query.
5. Perform positive and negative test cases.
6. Validate duplicate-cycle handling.
7. Record the actual outputs.
8. Update the documentation with verified results.
9. Commit the verified implementation/results separately.

---

## 15. Conclusion

This testing plan establishes a clear and verifiable approach for implementing the required A → B → C → A circular money-flow detection.

The current transaction dataset does not provide sender and receiver account information, so production verification is currently dependent on approved Neo4j access and/or suitable transfer-direction data.

No unverified or synthetic results are being presented as actual project results. The final verification will be completed once the required team access or approved data becomes available.