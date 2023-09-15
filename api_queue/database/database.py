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
        self, ticket_number, service_type, ticket_status, priority,
        waiting_time_for_service, unity_id
        ):

        query =f"""
            INSERT INTO fila (NumeroSenha, TipoServico, StatusSenha, Prioridade,
            TempoEsperaEstimado, GuicheAgente, UnidadeID)
            VALUES ({ticket_number}, '{service_type}', '{ticket_status}', {priority},
            {waiting_time_for_service}, '{0}', {unity_id})
            """     
        try:
            self.cursor.execute(query)
            self.conn.commit()
            return 'sucess'
        except Exception as e:
            self.conn.rollback()
            return 'error', e
    
    def emit_ticket_by_name(self, ticket_number, service_type, ticket_status,client_name,document_number, priority,
        waiting_time_for_service, unity_id):
        query =f"""
            INSERT INTO fila (NumeroSenha, TipoServico, StatusSenha,ClienteID, NomeCliente, NumeroDocumento, Prioridade,
            TempoEsperaEstimado, UnidadeID)
            VALUES ({ticket_number}, '{service_type}', '{ticket_status}', {0}, '{client_name}', '{document_number}', {priority},
            {waiting_time_for_service}, {unity_id})
            """
            
        try:
            self.cursor.execute(query)
            self.conn.commit()
            return 'sucess'
        
        except Exception as e:
            self.conn.rollback()
            return 'error', e
    
    def client_id_and_client_secret_api(self, client_id, client_secret):
        query = f"""
        SELECT * FROM tokensapi WHERE ClientID = '{client_id}' and ClientSecret = '{client_secret}'
        """
        self.cursor.execute(query)
        result = self.cursor.fetchall() 
        return result
    
    def client_id_and_client_secret_user_service_desk(self, client_id, client_secret):
        query = f"""
        SELECT * FROM usuarios WHERE UserApiID = '{client_id}' and userApiSecret = '{client_secret}'
        """
        self.cursor.execute(query)
        result = self.cursor.fetchall() 
        return result
    
    def get_actual_queue_number(self, unity_id):
        query = f"SELECT NumeroSenha FROM fila WHERE UnidadeID = {unity_id} order by NumeroSenha desc limit 1"
        
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def refresh_queue(self, unity_id):
        try:
            # Passo 1: Atualizar o status da senha para "Cancelado"
            update_query = f"UPDATE fila SET StatusSenha = 'Cancelado' WHERE UnidadeID = {unity_id}"
            self.cursor.execute(update_query)

            # Atualizar os comentários
            update_comments_query = f"UPDATE fila SET Comentarios = 'FILA ZERADA MANUALMENTE' WHERE UnidadeID = {unity_id}"
            self.cursor.execute(update_comments_query)

            # Passo 2: Mover os registros atualizados para o histórico
            insert_query = f"""
                INSERT INTO historicoatendimento (NumeroSenha, DataHoraInicio, ServicoID , Status, ClienteID, NomeCliente, NumeroDocumento, Prioridade, Comentarios, UnidadeID)
                SELECT NumeroSenha, DataHoraEmissao, TipoServico, StatusSenha, ClienteID, NomeCliente, NumeroDocumento, Prioridade, Comentarios, UnidadeID
                FROM fila
                WHERE StatusSenha = 'Cancelado' AND UnidadeID = {unity_id}
            """
            self.cursor.execute(insert_query)

            # Passo 3: Excluir os registros da fila
            delete_query = f"DELETE FROM fila WHERE StatusSenha = 'Cancelado' AND UnidadeID = {unity_id}"
            self.cursor.execute(delete_query)
            
            # Commit das alterações
            self.conn.commit()
            return 'sucess'
        
        except Exception as e:
            self.conn.rollback()
            return 'error', e

    def change_status_ticket(self, ticket_number, unity_id, status_senha):
        try:
            update_query = f"UPDATE fila SET StatusSenha = '{status_senha}' WHERE NumeroSenha = {ticket_number} AND UnidadeID = {unity_id}"
            self.cursor.execute(update_query)
            self.conn.commit()
            return 'sucess'
        
        except Exception as e:
            self.conn.rollback()
            return 'error', e

    def get_all_info_of_ticket(self, ticket_number, unity_id):
        query = f"SELECT * FROM fila WHERE NumeroSenha = {ticket_number} AND UnidadeID = {unity_id}"
        self.cursor.execute(query)

        # Mapear o nome das colunas para seus índices na tupla
        column_indices = {desc[0]: index for index, desc in enumerate(self.cursor.description)}

        result = self.cursor.fetchall(), column_indices
        if result:
            return result
        else:
            return None
    
    def get_service_type_description(self, service_type_id):
        query = f"SELECT NomeServico FROM servicos WHERE ServicoID = {service_type_id}"
        self.cursor.execute(query)
        return self.cursor.fetchall()[0]
    
    def update_service_desk(self, ticket_number, unity_id, service_desk_id):
        query = f"UPDATE fila SET GuicheAgente = {service_desk_id} WHERE NumeroSenha = {ticket_number} AND UnidadeID = {unity_id}"
        try:
            self.cursor.execute(query)
            self.conn.commit()
            return 'sucess'
        except Exception as e:
            self.conn.rollback()
            return 'error', e

    def get_all_info_user(self, user_name):
        query = f"SELECT * FROM usuarios WHERE NomeUsuario = '{user_name}'"
        self.cursor.execute(query)
    
        # Mapear o nome das colunas para seus índices na tupla
        column_indices = {desc[0]: index for index, desc in enumerate(self.cursor.description)}

        result = self.cursor.fetchall(), column_indices
        if result:
            return result
        else:
            return None
        
    def get_all_unitys(self):
        query = 'SELECT UnidadeID, NomeUnidade FROM unidades'
        self.cursor.execute(query)
        return self.cursor.fetchall()
if __name__ == "__main__":
    db = Database()
    print(db.select_all_from_query())
    print(db.get_actual_queue_number(1)[0][0])
