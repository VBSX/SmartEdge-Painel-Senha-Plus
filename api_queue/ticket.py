from database.database import Database

class Ticket():
    def __init__(self, ticket_number, unity_id):
        self.database = Database()
        self.ticket_number = ticket_number
        self.unity_id = unity_id
        self.column_indices = None  # Inicialize a variável column_indices como None
        self.has_data = False
        self.get_data()
         
    def get_data(self):
        self.ticket, self.column_indices = self.database.get_all_info_of_ticket(self.ticket_number, self.unity_id)
        if self.ticket and self.column_indices is not None:
            self.has_data = True
        else:
            self.has_data = False
            
    def status_ticket(self):
        if self.ticket and self.column_indices:
            # Acessa o valor da coluna 'StatusSenha' pelo índice numérico
            status_senha = self.ticket[0][self.column_indices['StatusSenha']]
            return status_senha
        else:
            return None 
    
    def change_status(self, status_senha):
        self.database.change_status_ticket(self.ticket_number, self.unity_id, status_senha)
        
    def client_name(self):
        if self.ticket and self.column_indices:
            # Acessa o valor da coluna 'Cliente' pelo índice numérico
            client_name = self.ticket[0][self.column_indices['NomeCliente']]
            return client_name
        else:
            return None
    
    def service_type_description(self):
        if self.ticket and self.column_indices:
            # Acessa o valor da coluna 'TipoServico' pelo índice numérico
            service_type_id = self.ticket[0][self.column_indices['TipoServico']]
            service_description = self.database.get_service_type_description(service_type_id)
            return service_description[0]
    
    def service_desk_change(self,service_desk_id):
        return_db = self.database.update_service_desk(self.ticket_number, self.unity_id, service_desk_id)
        return return_db
    
if __name__ == "__main__":
    t = Ticket(1, 1)
    print(t.ticket)
    print(t.status_ticket())
    print(t.service_type_description())

