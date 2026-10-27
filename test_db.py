
from db import get_db_connection

connection = get_db_connection()

try:
    print("MySQL connected successfully!")
    print("Database:", connection.database)
finally:
    connection.close()
