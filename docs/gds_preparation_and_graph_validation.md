# FinGraph – GDS Preparation & Graph Validation

## 1. Objective

The objective of this work was to verify that the Neo4j environment is ready for Graph Data Science analysis and to validate the synthetic test graph that will be used for community-detection testing.

The validation was performed without modifying the existing Week 1 and Week 2 analytics data.

## 2. GDS Availability Verification

The Neo4j database was checked for available Graph Data Science procedures.

### Verification Query

SHOW PROCEDURES YIELD name
WHERE name STARTS WITH 'gds.'
RETURN name
ORDER BY name
LIMIT 20;

### Result

Neo4j GDS procedures were available in the database.

This confirms that Graph Data Science functionality is installed and accessible.

## 3. Louvain Availability Verification

The availability of the Louvain community-detection algorithm was specifically verified.

### Verification Query

SHOW PROCEDURES YIELD name
WHERE name CONTAINS 'louvain'
RETURN name
ORDER BY name;

### Verified Procedures

The following Louvain procedures were available:

- gds.louvain.stream
- gds.louvain.write
- gds.louvain.stats
- gds.louvain.mutate
- Corresponding estimate procedures

Therefore, the Neo4j environment supports Louvain community detection.

## 4. Synthetic Test Graph

Because an updated transaction dataset was not available for validating the graph analytics workflow, a small synthetic graph was created specifically for testing.

The synthetic data is clearly identified using:

test_data = true

This test graph must not be treated as production transaction data.

## 5. Test Relationships

The validated synthetic relationships are:

TEST_A → TEST_B
TEST_B → TEST_C
TEST_C → TEST_A
TEST_D → TEST_A

The first three relationships form a circular flow:

TEST_A → TEST_B → TEST_C → TEST_A

The fourth relationship provides an additional connected test account:

TEST_D → TEST_A

## 6. Test Relationship Verification

### Query

MATCH (a:Account)-[r:TRANSFERRED_TO]->(b:Account)
WHERE a.account_id STARTS WITH 'TEST'
RETURN
    a.account_id AS from_account,
    b.account_id AS to_account,
    r.test_data AS test_data
ORDER BY from_account, to_account;

### Verified Result

| From Account | To Account | Test Data |
|---|---|---|
| TEST_A | TEST_B | TRUE |
| TEST_B | TEST_C | TRUE |
| TEST_C | TEST_A | TRUE |
| TEST_D | TEST_A | TRUE |

All four relationships were confirmed as synthetic test data.

## 7. Transfer Relationship Validation

### Query

MATCH (a:Account)-[r:TRANSFERRED_TO]->(b:Account)
RETURN
    count(r) AS transfer_relationships,
    count(DISTINCT a) AS source_accounts,
    count(DISTINCT b) AS destination_accounts;

### Verified Result

- Transfer relationships: 4
- Source accounts: 4
- Destination accounts: 3

## 8. GDS Graph Catalog Verification

The existing GDS graph catalog was checked before creating a new projection.

### Query

CALL gds.graph.list()
YIELD graphName, nodeCount, relationshipCount
RETURN graphName, nodeCount, relationshipCount
ORDER BY graphName;

### Result

No existing named GDS projections were found.

This confirms that a new GDS projection can be created without conflicting with an existing named projection.

## 9. Validation Summary

The following prerequisites were successfully verified:

- Neo4j GDS is available.
- Louvain procedures are available.
- Account nodes are available.
- TRANSFERRED_TO relationships are available.
- Synthetic test relationships are correctly marked with test_data = true.
- The circular test structure exists.
- No existing named GDS projection was found.

## 10. Data Safety

No existing Week 1 or Week 2 analytics data was modified during these validation checks.

No production transaction relationships were created or changed as part of this validation.

The synthetic TEST_* graph is used only for validating the graph analytics workflow.

## 11. Next Planned Analysis

The next analysis step will use the validated synthetic graph to create a GDS graph projection and test Louvain community detection.

The resulting community assignments will then be verified and documented before applying the methodology to any appropriate project dataset.

## 12. Conclusion

The Neo4j environment and synthetic graph have been successfully validated for the upcoming graph-data-science analysis.

The environment is ready for the next stage of community detection testing.