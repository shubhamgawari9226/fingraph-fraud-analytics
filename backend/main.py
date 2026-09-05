
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import driver

app = FastAPI(title="FinGraph API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#app = FastAPI(title="FinGraph API")


@app.get("/")
def root():
    return {"message": "FinGraph Backend Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-test")
def db_test():
    try:
        with driver.session() as session:
            result = session.run(
                "MATCH (a:Account) RETURN count(a) AS total_accounts"
            )
            record = result.single()

            return {
                "database": "connected",
                "total_accounts": record["total_accounts"]
            }

    except Exception as e:
        return {"error": str(e)}


# Dashboard statistics API
@app.get("/stats")
def get_stats():
    try:
        with driver.session() as session:

            accounts = session.run(
                "MATCH (a:Account) RETURN count(a) AS count"
            ).single()["count"]

            transactions = session.run(
                "MATCH (t:Transaction) RETURN count(t) AS count"
            ).single()["count"]

            fraud = session.run(
                "MATCH (t:Transaction) WHERE t.fraud_label <> 'normal' RETURN count(t) AS count"
            ).single()["count"]

            high_risk = session.run(
                "MATCH (t:Transaction) WHERE t.risk_index >= 0.8 RETURN count(t) AS count"
            ).single()["count"]

            return {
                "total_accounts": accounts,
                "total_transactions": transactions,
                "fraud_transactions": fraud,
                "high_risk_transactions": high_risk
            }

    except Exception as e:
        return {"error": str(e)}

# Latest transactions API
@app.get('/transactions')
def get_transactions(
    page: int = 1,
    limit: int = 10,
    channel: str | None = None
):
    try:
        skip = (page - 1) * limit

        with driver.session() as session:

            if channel:
                total_query = '''
                MATCH (t:Transaction)
                WHERE t.payment_channel = $channel
                RETURN count(t) AS count
                '''

                data_query = '''
                MATCH (a:Account)-[:MADE]->(t:Transaction)
                WHERE t.payment_channel = $channel
                RETURN
                    t.txn_id AS txn_id,
                    a.account_id AS account_id,
                    t.txn_amount AS amount,
                    t.txn_currency AS currency,
                    t.payment_channel AS channel,
                    t.fraud_label AS fraud_label,
                    t.risk_index AS risk_index,
                    t.txn_datetime AS txn_datetime
                ORDER BY t.txn_datetime DESC
                SKIP $skip
                LIMIT $limit
                '''
            else:
                total_query = '''
                MATCH (t:Transaction)
                RETURN count(t) AS count
                '''

                data_query = '''
                MATCH (a:Account)-[:MADE]->(t:Transaction)
                RETURN
                    t.txn_id AS txn_id,
                    a.account_id AS account_id,
                    t.txn_amount AS amount,
                    t.txn_currency AS currency,
                    t.payment_channel AS channel,
                    t.fraud_label AS fraud_label,
                    t.risk_index AS risk_index,
                    t.txn_datetime AS txn_datetime
                ORDER BY t.txn_datetime DESC
                SKIP $skip
                LIMIT $limit
                '''

            total = session.run(
                total_query,
                channel=channel
            ).single()['count']

            result = session.run(
                data_query,
                skip=skip,
                limit=limit,
                channel=channel
            )

            transactions = [dict(record) for record in result]

            return {
                'page': page,
                'limit': limit,
                'channel': channel,
                'total': total,
                'count': len(transactions),
                'transactions': transactions
            }

    except Exception as e:
        return {'error': str(e)}

@app.get('/fraud-summary')
def get_fraud_summary():
    try:
        with driver.session() as session:

            total = session.run(
                'MATCH (t:Transaction) RETURN count(t) AS count'
            ).single()['count']

            suspicious = session.run(
                '''
                MATCH (t:Transaction)
                WHERE t.fraud_label <> 'normal'
                RETURN count(t) AS count
                '''
            ).single()['count']

            high_risk = session.run(
                '''
                MATCH (t:Transaction)
                WHERE t.risk_index >= 0.8
                RETURN count(t) AS count
                '''
            ).single()['count']

            fraud_percentage = round((suspicious / total) * 100, 2) if total else 0
            high_risk_percentage = round((high_risk / total) * 100, 2) if total else 0

            return {
                'total_transactions': total,
                'suspicious_transactions': suspicious,
                'high_risk_transactions': high_risk,
                'fraud_percentage': fraud_percentage,
                'high_risk_percentage': high_risk_percentage
            }

    except Exception as e:
        return {'error': str(e)}
@app.get('/merchant-analytics')
def get_merchant_analytics():
    try:
        with driver.session() as session:

            result = session.run(
                '''
                MATCH (t:Transaction)-[:AT_MERCHANT]->(m:Merchant)
                RETURN
                    m.merchant_type AS merchant_type,
                    count(t) AS total_transactions,
                    sum(CASE WHEN t.fraud_label <> 'normal' THEN 1 ELSE 0 END) AS suspicious_transactions
                ORDER BY total_transactions DESC
                '''
            )

            merchants = [dict(record) for record in result]

            return {
                'count': len(merchants),
                'merchants': merchants
            }

    except Exception as e:
        return {'error': str(e)}

@app.get('/location-analytics')
def get_location_analytics():
    try:
        with driver.session() as session:

            result = session.run(
                '''
                MATCH (t:Transaction)-[:OCCURRED_IN]->(l:Location)
                RETURN
                    l.city AS city,
                    count(t) AS total_transactions,
                    sum(CASE WHEN t.fraud_label <> 'normal' THEN 1 ELSE 0 END) AS suspicious_transactions
                ORDER BY total_transactions DESC
                '''
            )

            locations = [dict(record) for record in result]

            return {
                'count': len(locations),
                'locations': locations
            }

    except Exception as e:
        return {'error': str(e)}
# @app.get('/location-analytics')
# def get_location_analytics():
#     try:
#         with driver.session() as session:

#             result = session.run(
#                 '''
#                 MATCH (t:Transaction)-[:IN_LOCATION]->(l:Location)
#                 RETURN
#                     l.city AS city,
#                     count(t) AS total_transactions,
#                     sum(CASE WHEN t.fraud_label <> 'normal' THEN 1 ELSE 0 END) AS suspicious_transactions
#                 ORDER BY total_transactions DESC
#                 '''
#             )

#             locations = [dict(record) for record in result]

#             return {
#                 'count': len(locations),
#                 'locations': locations
#             }

#     except Exception as e:
#         return {'error': str(e)}