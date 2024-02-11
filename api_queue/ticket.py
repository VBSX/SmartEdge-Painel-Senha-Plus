import os
import sys
path = os.path.abspath('./')
sys.path.append(path)
from api_queue.database.database import Database

class Ticket():
    def __init__(self, ticket_number, unity_id):
        self.database = Database()
        self.ticket_number = ticket_number
        self.unity_id = unity_id
        self.has_data = False
        self.get_data()
         
    def get_data(self):
        return_db,queue_data = self.database.get_ticket(self.ticket_number, self.unity_id)
        if return_db == 'sucess':
            self.has_data = True
    
    def get_hora_data_emissao_ticket(self, data):
        data_emissao = data[2].strftime("%d/%m/%Y")
        hora_emissao = data[2].strftime("%H:%M:%S")
        return data_emissao, hora_emissao

    def status_ticket(self):
        status_senha = self.database.get_status_of_ticket(self.ticket_number, self.unity_id)
        return status_senha

    def change_status(self, status_senha):
        return self.database.change_status_ticket(self.ticket_number, self.unity_id, status_senha)
        
    def customer_name(self):
        return_db, name = self.database.get_customer_name(self.ticket_number, self.unity_id)
        return name[0][0]
    
    def service_type_description(self):
        service_type_of_ticket = self.get_service_type_of_ticket()[1][0][0]
        print(service_type_of_ticket)
        return self.database.get_service_type_description(service_type_of_ticket )
    
    def get_service_type_of_ticket(self):
        return self.database.get_service_type_of_ticket(self.ticket_number, self.unity_id)
    
    def service_desk_change(self,service_desk_id):
        # altera o ticket para o atendente que ira tratar o atendimento
        return_db = self.database.update_service_desk(self.ticket_number, self.unity_id, service_desk_id)
        return return_db
    
if __name__ == "__main__":
    t = Ticket(1, 1)
    print(t.ticket)
    print(t.status_ticket())
    print(t.service_type_description())

