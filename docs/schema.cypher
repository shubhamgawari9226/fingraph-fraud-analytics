// FinGraph Data Engineering - Neo4j Graph Constraints and Indexes (shubhamgawari9226)
// Schema based on transactions_dataset.csv

// Unique constraints

CREATE CONSTRAINT account_id_unique IF NOT EXISTS
FOR (a:Account)
REQUIRE a.account_id IS UNIQUE;

CREATE CONSTRAINT card_no_unique IF NOT EXISTS
FOR (c:Card)
REQUIRE c.card_no IS UNIQUE;

CREATE CONSTRAINT txn_id_unique IF NOT EXISTS
FOR (t:Transaction)
REQUIRE t.txn_id IS UNIQUE;

CREATE CONSTRAINT location_unique IF NOT EXISTS
FOR (l:Location)
REQUIRE l.city IS UNIQUE;

CREATE CONSTRAINT merchant_type_unique IF NOT EXISTS
FOR (m:Merchant)
REQUIRE m.merchant_type IS UNIQUE;