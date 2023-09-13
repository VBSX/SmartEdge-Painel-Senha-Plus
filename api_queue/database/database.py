import mysql.connector
from dotenv import load_dotenv
from os import getenv

class Database():
    def __init__(self):
        load_dotenv()
        user = getenv("user")
        password = getenv("password")
        host = getenv("host")
        database = getenv("database")

        self.config = {
            'user': user,
            'password': password,
            'host': host, 
            'database': database,
        }
        self.conn = mysql.connector.connect(**self.config)
        self.cursor = self.conn.cursor()

    def select_all_from_query(self):
        query = "SELECT * FROM fila"
        
        self.cursor.execute(query)
        return self.cursor.fetchall()
    
    def emit_ticket_by_number(
        self, ticket_number, service_type, ticket_status, contact_client, priority,
        waiting_time_for_service, service_desk, unity_id
        ):
        client_id = '1'
        client_name = 'default'
        query =f"""
            INSERT INTO fila (ticket_number, service_type, ticket_status,client_id, client_name, priority,
            waiting_time_for_service, service_desk, unity_id)
            VALUES ({ticket_number}, '{service_type}', '{ticket_status}', {client_id}, '{client_name}', 'default', {priority},
            {waiting_time_for_service}, '{service_desk}', {unity_id})
            """
        try:
            self.cursor.execute(query)
            self.conn.commit()
            return 'sucess'
        
        except Exception as e:
            return 'error', e
        
    
if __name__ == "__main__":
    db = Database()
    print(db.select_all_from_query())