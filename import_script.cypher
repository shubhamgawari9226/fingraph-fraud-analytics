LOAD CSV WITH HEADERS FROM 'file:///transactions_dataset.csv' AS row
MERGE (cust:Customer {account: row.customer_account})
MERGE (merch:MerchantType {type: row.merchant_type})
CREATE (t:Transaction {
    id: row.txn_id,
    dateTime: row.txn_datetime,
    cardNumber: row.card_no,
    amount: toFloat(row.txn_amount),
    currency: row.txn_currency,
    city: row.city,
    countryCode: row.country_code,
    paymentChannel: row.payment_channel
})
CREATE (cust)-[:MADE_TRANSACTION]->(t)
CREATE (t)-[:CATEGORIZED_AS]->(merch);
