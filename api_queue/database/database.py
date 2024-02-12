import mysql.connector
from mysql.connector import  connect, Error
from dotenv import load_dotenv
from os import getenv

class Database():
    def __init__(self):
        load_dotenv()
        user = getenv("user")
        password = getenv("password")
        host = getenv("host")
        database = getenv("database")
        self.message_connection_error = None
        self.first_connection = True
        self.connected =False
        self.connection_error = False
        
        
        self.config = {
            'user': user,
            'password': password,
            'host': host, 
            'database': database,
        }
        

    def execute_query(self, query):
        has_connection = self.verify_connection()
        if has_connection:
            try:
                self.cursor.execute(query)
                try:
                    self.conexao.commit()
                except:
                    pass
                self.cursor.close()
                self.conexao.close()
                self.connected = False
                return 'sucess'
            except Error as er:
                return er
        else:
            self.connected = False
            self.conexao.rollback()
            Exception ("banco de dados desconectado")
            return self.message_connection_error
        
    def execute_query_return(self, query):
        has_connection = self.verify_connection()
        if has_connection:
            try:
                self.cursor.execute(query)
                self.connected = False
                return 'sucess',self.cursor.fetchall()
            except Error as er:
                self.conexao.rollback()
                return 'error', er
        else:
            self.connected = False
            Exception ("banco de dados desconectado")
            return self.message_connection_error   
        
    def verify_connection(self):
        if self.first_connection:
            connection = self.start_connection()
            if connection:
                self.first_connection = False
                return True
            else: 
                return False
        else: 
            if self.connected:
                return True
            else:
                connection = self.start_connection()
                if connection:
                    return True
                else:
                    return False
                
    def start_connection(self):
        self.connection_error = False
        try:
            self.conexao = connect(**self.config)
            self.connected = True
            self.cursor = self.conexao.cursor()
            return True       
             
        except Error as er:
            self.connection_error = True
            self.connected = False
            self.message_connection_error = er
            
            print(er)
            return False      
        
    def select_actual_queue(self,UnidadeID):
        query = f"""
        SELECT
            NumeroSenha,
            DataHoraEmissao,
            TipoServico,
            StatusSenha,
            ClienteID,
            NomeCliente,
            NumeroDocumento,
            Prioridade
        from
            fila
        where
            UnidadeID = {UnidadeID}
            and StatusSenha = 'aguardando'
            """
        return self.execute_query_return(query)
    
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
        return self.execute_query(query)
    
    def emit_ticket_by_name(self, ticket_number, service_type, ticket_status,client_name,document_number, priority,
        waiting_time_for_service, unity_id):
        query =f"""
            INSERT INTO fila (NumeroSenha, TipoServico, StatusSenha,ClienteID, NomeCliente, NumeroDocumento, Prioridade,
            TempoEsperaEstimado, UnidadeID)
            VALUES ({ticket_number}, '{service_type}', '{ticket_status}', {0}, '{client_name}', '{document_number}', {priority},
            {waiting_time_for_service}, {unity_id})
            """
        return self.execute_query(query)

    def client_id_and_client_secret_api(self, client_id, client_secret):
        query = f"""
        SELECT * FROM tokensapi WHERE ClientID = '{client_id}' and ClientSecret = '{client_secret}'
        """
        return self.execute_query_return(query)
    
    def client_id_and_client_secret_user_service_desk(self, client_id, client_secret):
        query = f"""
        SELECT * FROM usuarios WHERE UserApiID = '{client_id}' and userApiSecret = '{client_secret}'
        """
        return self.execute_query_return(query)
    
    def get_actual_queue_number(self, unity_id):
        query = f"SELECT NumeroSenha FROM fila WHERE UnidadeID = {unity_id} order by NumeroSenha desc limit 1"
        return self.execute_query_return(query)

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

    def delete_ticket(self, ticket_number, unity_id):
        query = f"UPDATE fila SET StatusSenha = 'Cancelado' WHERE NumeroSenha = {ticket_number} AND UnidadeID = {unity_id}"
        return self.execute_query(query)

    def change_status_ticket(self, ticket_number, unity_id, status_senha):
        query = f"UPDATE fila SET StatusSenha = '{status_senha}' WHERE NumeroSenha = {ticket_number} AND UnidadeID = {unity_id}"
        return self.execute_query(query)

    def get_ticket(self, ticket_number, unity_id):
        query = f"""
        SELECT 
            SenhaID,
            NumeroSenha
        FROM
            fila
        WHERE NumeroSenha = {ticket_number} 
        AND UnidadeID = {unity_id}"""
        return self.execute_query_return(query)
    
    def get_service_type_description(self, service_type_id):
        query = f"SELECT NomeServico FROM servicos WHERE ServicoID = {service_type_id}"
        return self.execute_query_return(query)
    
    def update_service_desk(self, ticket_number, unity_id, service_desk_id):
        query = f"UPDATE fila SET GuicheAgente = {service_desk_id} WHERE NumeroSenha = {ticket_number} AND UnidadeID = {unity_id}"
        return self.execute_query(query)

    def get_password_of_user(self, user_name):
        query = f"SELECT Senha FROM usuarios WHERE NomeUsuario = '{user_name}'"
        return self.execute_query_return(query)
    
    def get_all_unitys(self):
        query = 'SELECT UnidadeID, NomeUnidade FROM unidades'
        return self.execute_query_return(query)

    def get_status_of_ticket(self, ticket_number, unity_id):
        query = f"""
        SELECT 
            StatusSenha
        FROM
            fila
        WHERE NumeroSenha = {ticket_number} 
        AND UnidadeID = {unity_id}"""
        return self.execute_query_return(query)
    
    def get_customer_name(self, ticket_number, unity_id):
        query = f"""
        SELECT
            NomeCliente
        FROM
            fila
        WHERE NumeroSenha = {ticket_number}
        AND UnidadeID = {unity_id}"""
        return self.execute_query_return(query)
    
    
    def get_service_type_of_ticket(self, ticket_number, unity_id):
        query = f"""
        SELECT
            TipoServico
        FROM fila
        WHERE 
            NumeroSenha = {ticket_number} 
        AND 
            UnidadeID = {unity_id}
        """
        return self.execute_query_return(query)
        
    def get_all_info_of_user(self, user_name):
        query = f"SELECT * FROM usuarios WHERE NomeUsuario = '{user_name}'"
        return self.execute_query_return(query)
    
    def get_all_unity_user_have_acess(self, user_id):
        query = f"""
        SELECT usuariounidade.UnidadeID ,u.NomeUnidade 
        FROM usuariounidade
        LEFT JOIN unidades u ON usuariounidade.UnidadeID = u.UnidadeID
        WHERE UsuarioID ='{user_id}'"""
        return self.execute_query_return(query)
    
    def update_unity_of_user(self, user_id, unity_id):
        query = f"UPDATE usuarios SET UltimaUnidadeUsada = {unity_id} WHERE UsuarioID = '{user_id}'"
        return self.execute_query(query)
    
    def get_unity_name(self, unity_id):
        query = f"SELECT NomeUnidade FROM unidades WHERE UnidadeID = {unity_id}"
        return self.execute_query_return(query)
    
if __name__ == "__main__":
    db = Database()
    # print(db.select_all_from_query())
    print(db.select_actual_queue(1))
