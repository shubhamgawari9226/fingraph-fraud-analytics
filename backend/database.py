# from neo4j import GraphDatabase

# URI = "bolt://127.0.0.1:7687"
# USERNAME = "neo4j"
# PASSWORD = "Sandiop@123"

# driver = GraphDatabase.driver(
#     URI,
#     auth=(USERNAME, PASSWORD)
# )
from neo4j import GraphDatabase

URI = 'neo4j://127.0.0.1:7687'
USERNAME = 'neo4j'
PASSWORD = 'Sandip@1234'

driver = GraphDatabase.driver(
    URI,
    auth=(USERNAME, PASSWORD)
)