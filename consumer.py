import json
from kafka import KafkaConsumer

# 1. Initialize Kafka Consumer Configuration
KAFKA_TOPIC = 'financial-transactions'
KAFKA_SERVER = 'localhost:9092'

print(f"Initializing Kafka Consumer engine for topic: '{KAFKA_TOPIC}'...")

try:
    consumer = KafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=[KAFKA_SERVER],
        auto_offset_reset='latest',  # Read fresh live data packets arriving now
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )
    print(f"Connected to Kafka broker. Waiting for real-time live data blocks...\n")
except Exception as e:
    print(f"Error: Could not connect to Kafka server. Details: {e}")
    consumer = None

# 2. Read and Parse the Incoming Live Stream Fields
if consumer is not None:
    try:
        for message in consumer:
            transaction_data = message.value
            
            # Dynamically extract fields matching your exact column headers
            tx_id = transaction_data.get('txn_id', 'N/A')
            timestamp = transaction_data.get('txn_datetime', 'N/A')
            amount = transaction_data.get('txn_amount', 'N/A')
            currency = transaction_data.get('txn_currency', 'N/A')
            city = transaction_data.get('city', 'N/A')
            label = str(transaction_data.get('fraud_label', 'N/A')).lower()
            
            # Print parsed records cleanly in tracking panel
            print("-" * 60)
            print(f"🚀 [LIVE TRANSACTION RECORD CAPTURED]")
            print(f"   🔹 ID        : {tx_id}")
            print(f"   🔹 Timestamp : {timestamp}")
            print(f"   🔹 Amount    : {amount} {currency}")
            print(f"   🔹 Location  : {city}")
            print(f"   🔹 Label     : {label}")
            
            # Automated flagging engine based on your new labels
            if 'suspicious' in label or '1' in label:
                print("   ⚠️  ALERT: Critical Suspicious Activity Flagged on this Account!")
                
    except KeyboardInterrupt:
        print("\nShutting down stream consumer node gracefully...")
