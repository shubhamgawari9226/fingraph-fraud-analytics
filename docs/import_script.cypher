// FinGraph - CSV Import Script for Neo4j
// Run this in Neo4j Browser after placing transactions_dataset.csv in the Neo4j import/ folder
// Neo4j Desktop import path: Click "..." on your DB → Open folder → import/

// ============================================
// STEP 1: Create Schema Constraints
// ============================================

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

// ============================================
// STEP 2: Load CSV and Create All Nodes + Relationships
// Run this AFTER constraints are created
// ============================================

LOAD CSV WITH HEADERS FROM 'file:///transactions_dataset.csv' AS row

// Create or merge Account
MERGE (a:Account {account_id: row.customer_account})

// Create or merge Card
MERGE (c:Card {card_no: row.card_no})

// Create Transaction
CREATE (t:Transaction {
  txn_id: row.txn_id,
  txn_datetime: row.txn_datetime,
  txn_amount: toFloat(row.txn_amount),
  txn_currency: row.txn_currency,
  payment_channel: row.payment_channel,
  km_from_home: toFloat(row.km_from_home),
  foreign_txn_flag: toInteger(row.foreign_txn_flag),
  txn_count_past_hour: toInteger(row.txn_count_past_hour),
  fraud_label: row.fraud_label,
  risk_index: toFloat(row.risk_index)
})

// Create or merge Location
MERGE (l:Location {city: row.city})
ON CREATE SET l.country_code = row.country_code

// Create or merge Merchant
MERGE (m:Merchant {merchant_type: row.merchant_type})

// Create Relationships
MERGE (a)-[:USES_CARD]->(c)
CREATE (a)-[:MADE]->(t)
CREATE (t)-[:OCCURRED_IN]->(l)
CREATE (t)-[:AT_MERCHANT]->(m);
