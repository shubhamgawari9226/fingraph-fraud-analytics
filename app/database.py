import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

URI = os.getenv('NEO4J_URI', 'neo4j://127.0.0.1:7687')
USERNAME = os.getenv('NEO4J_USERNAME', 'neo4j')
PASSWORD = os.getenv('NEO4J_PASSWORD', 'neo4j')

driver = GraphDatabase.driver(
    URI,
    auth=(USERNAME, PASSWORD)
)