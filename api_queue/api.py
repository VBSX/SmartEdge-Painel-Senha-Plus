import os
import sys
path = os.path.abspath('./')
sys.path.append(path)
from flask import (
    Flask,
    jsonify,
    request)
import requests
from api_queue.database.database import Database
from api_queue.ticket import Ticket

class ApiQueue(Flask):
    def __init__(self,ip):
        super().__init__(__name__)
        self.url_panel_desktop = f'http://{ip}:5001/display'
        self.url_panel_smartphone = f'http://{ip}:5003/display'
        self.route('/queue', methods=['GET'])(self.get_queue)
        self.route('/queue', methods=['POST'])(self.emit_ticket)
        self.route('/call', methods=['POST'])(self.call_ticket)
        self.route('/queue', methods=['DELETE'])(self.delete_queue)
        self.queue = []
        self.current_ticket_number = 1
        self.refresh_count = False
        # tambem precisa depois fazer o processo para que seja adicionado a letra junto
        # ao numero do ticket dependendo do serviço e da unidade que veio a senha
        self.database = Database()

    def get_queue(self):
        """
        Função para apresentar a fila de acordo com a unidade do usuario
        argumentos esperados na requisição:

            unity_id
        
        argumentos retornados: 
            ticket_number,
            date_emission,
            hour_emission,
            service_type,
            status_ticket,
            client_id,
            name,
            document_number,
            priority
        """
        
        if request.method =='GET':
            unity_id = request.args.get('unity_id')
            if unity_id:
                return_db, queue = self.database.select_actual_queue(unity_id)
                if return_db == 'sucess':
                    list_of_queue = []
                    # como o banco irá retornar uma lista, é necessário transforma-lo em um json
                    # configurando com o nome do campo
                    # para que seja mais facil para utilizar depois
                    for item in queue:
                        # como o banco retorna datetime.datetime para a hora da emissão 
                        # é necessário separa-lo para pegar apenas a data
                        data_formatada = item[1].strftime("%d/%m/%Y")
                        hora_formatada = item[1].strftime("%H:%M:%S")
                        
                        json = {
                            'ticket_number': item[0],
                            'date_emission': data_formatada,
                            'hour_emission': hora_formatada,
                            'service_type': item[2],
                            'status_ticket': item[3],
                            'client_id': item[4],
                            'name': item[5],
                            'document_number': item[6],
                            'priority': item[7]
                        }
                        list_of_queue.append(json)
                        
                    return jsonify(list_of_queue),200
                             
                else:
                    return jsonify({'error': str(queue)}), 400
            else:
                return jsonify({'error': 'Sem o Id da Unidade'}), 400  

    def emit_ticket(self):
        """
        Função para emitir o ticket adicionando ele na fila
        argumentos esperados na requisição:
        name
        document_number
        type_ticket
        priority
        service_type
        unity_id
        type_emission
        client_secret
        client_id
        """
        if request.method == 'POST':
            name = request.form.get('name')
            document_number = request.form.get('document_number')
            
            type_ticket = request.form.get('type_ticket')
            priority = request.form.get('priority')
            service_type = request.form.get('service_type')
            unity_id = request.form.get('unity_id')
            type_emission = request.form.get('type_emission')
            
            client_secret = request.form.get('client_secret')
            client_id = request.form.get('client_id')
            print(client_id, client_secret, type_emission, type_ticket, priority, service_type, unity_id, name, document_number)
            if self.verify_if_client_has_permission(type_emission, client_id, client_secret):
                if type_ticket == 'ticket_by_name':
                    return self.emit_ticket_by_name(priority, service_type, unity_id, name, document_number)    
                elif type_ticket == 'ticket_by_number':
                    return self.emit_ticket_by_number(service_type, priority, unity_id)
                else:
                    return jsonify({'error': 'Type ticket is invalid'}), 400
            else:
                return jsonify({'error': 'ClientId / Secret are invalid'}), 400  
            
    def verify_if_client_has_permission(self,type_emission, client_id, client_secret):
        verify_client_id_and_secret_of_api = self.database.client_id_and_client_secret_api(client_id, client_secret)
        verify_client_id_and_secret_of_user_service_desk = self.database.client_id_and_client_secret_user_service_desk(client_id, client_secret)
        if type_emission == 'totem':
            if verify_client_id_and_secret_of_api:
                return True
            else: return False  
        elif type_emission == 'service_desk':
            if verify_client_id_and_secret_of_user_service_desk:
                return True
            else: return False
        else:
            return False
            
    def emit_ticket_by_name(self, priority, service_type, unity_id, name, document_number):
        if name and not document_number:
            return jsonify({'error': 'Name and document number are required'}), 400
        if not name and document_number:
            return jsonify({'error': 'Name and document number are required'}), 400
        
        if name in [ticket['name'] for ticket in self.queue] and document_number in [ticket['document_number'] for ticket in self.queue]:
            return jsonify({'error': 'Nome Ou numero do documento já está na fila'}), 400
        
        if name and document_number:
            ticket_status='aguardando'
            waiting_time_for_service= 1
            
            ticket_number = self.get_actual_queue_number(unity_id) 
            if ticket_number == 'Fila Vazia':
                ticket_number = 1
            else:
                ticket_number += 1
                
            return_database = self.database.emit_ticket_by_name(
                ticket_number,service_type,ticket_status,name, document_number, priority, waiting_time_for_service,unity_id
            )
            print(return_database, 'return_database')
            if return_database =='sucess':
                ticket = {
                    'ticket_number': f'{self.current_ticket_number}',
                    'name': name,
                    'document_number': document_number
                }
                return jsonify({'ticket': ticket}), 200
            else:
                return jsonify({'error': str(return_database)}), 400
        else:
            return jsonify({'error': 'Name and document number are required'}), 400
            
    def emit_ticket_by_number(self, service_type, priority, unity_id):
        ticket_status='aguardando'
        waiting_time_for_service= 1
        ticket_number = self.get_actual_queue_number(unity_id) 
        
        if ticket_number == 'Fila Vazia':
            ticket_number = 1
        else:
            ticket_number += 1
            
        return_database = self.database.emit_ticket_by_number(
            ticket_number,
            service_type,
            ticket_status,
            priority,
            waiting_time_for_service,
            unity_id,
        )
        
        if return_database =='sucess':
            ticket = {
                'ticket_number': f'{ticket_number}',
            }
            return jsonify({'ticket': ticket}), 200
        else:
            return jsonify({'error': str(return_database[1])}), 400
        
    def get_actual_queue_number(self, unity_id):
        return_db, ticket = self.database.get_actual_queue_number(unity_id) 
        
        if return_db == 'sucess':
            if ticket:
                print(ticket[0][0],'adsasdasdasd')
                ticket = ticket[0][0]
                return ticket
            else: 
                return 'Fila Vazia'

    def call_ticket(self):
        """
        Função para chamar a próxima senha da fila e mostrar na tela.
        argumentos esperados na requisição:
        ticket_number
        unity_id
        service_desk
        """
        if request.method == 'POST':
            ticket_number = request.form.get('ticket_number')
            unity_id = request.form.get('unity_id')
            service_desk = request.form.get('service_desk')
            print(ticket_number, unity_id, service_desk)
        
            if ticket_number and unity_id and service_desk:
                ticket = Ticket(ticket_number, unity_id)
                if ticket.has_data:
                    status_ticket = ticket.status_ticket()
                    service_type = ticket.service_type_description()
                    
                    queue  = self.get_actual_queue_number(unity_id)
                    # Verificar se a fila está vazia
                    if queue == 'Fila Vazia':
                        return jsonify({'error': 'A fila está vazia.'}), 404

                    if status_ticket == 'aguardando':
                        ticket.change_status('Em andamento')
                        name = ticket.client_name()
                        ticket.service_desk_change(service_desk)
                        #TODO Caso a senha ja foi chamada, e o atendente quer chamar novamente
                        # fazer uma função de recall de senhas.
                        
                        # Fazer chamada da API para mostrar o conteudo na tela
                        display_response = self.do_request_for_panel_web(
                            name, unity_id, service_desk, service_type, ticket_number)
                        try:
                            self.do_request_for_panel_smartphone(
                                name, unity_id, service_desk, service_type, ticket_number)
                        except:
                            print('Erro ao chamar a API do Smartphone.') 
                            
                        if display_response.status_code == 200:   
                            return jsonify({'message': 'Senha chamada com sucesso e conteúdo mostrado na tela.'}), 200
                        else:
                            return jsonify({'error': 'Erro ao chamar a senha ou mostrar o conteúdo na tela.'}), 500
                    else:
                        return jsonify({'error': 'Senha já foi chamada.'}), 404
                else:
                    return jsonify({'error': 'Ticket não encontrado.'}), 404
            else:
                return jsonify({'error': 'Parâmetros não informados.'}), 400

    def do_request_for_panel_web(self, name, unity_id, service_desk, service_type, ticket_number):
        display_response = requests.post(self.url_panel_desktop, json={
            'name': name,
            'unity_id' : unity_id,
            'service_desk': service_desk,
            'service_type': service_type,
            'ticket_number':ticket_number})
        return display_response

    def do_request_for_panel_smartphone(self, name, unity_id, service_desk, service_type, ticket_number):
        display_response = requests.post(self.url_panel_smartphone, json={
            'name': name,
            'unity_id' : unity_id,
            'service_desk': service_desk,
            'service_type': service_type,
            'ticket_number':ticket_number})
        return display_response   
    
    def delete_queue(self):
        zerar_fila = request.form.get('zerar_fila')
        reiniciar_contagem = request.form.get('reiniciar_contagem')
        ticket_name = request.form.get('name')
        ticket_document_number = request.form.get('document_number')
        ticket_number = request.form.get('ticket_number')
        type_emission = 'service_desk'
        unity_id = request.form.get('unity_id')

        client_secret = request.form.get('client_secret')
        client_id = request.form.get('client_id')
        
        has_permission = self.verify_if_client_has_permission(type_emission, client_id, client_secret)
        # verificar se e possivel realizar uma validação de unidade antes de mandar o delete
        # fazer uma validação se a senha ja foi removida, ou existe
        if has_permission:
            
            if zerar_fila == 1:
                if self.get_actual_queue_number(unity_id) == 'Fila Vazia':
                    return jsonify({'error': 'Fila Vazia.'}), 404
                else:
                    return self.refresh_queue(unity_id)

            elif reiniciar_contagem == 1:
                self.current_ticket_number = 1
                return jsonify({'message': 'Contagem de senhas reiniciada.'}), 200
            
            elif ticket_number and unity_id:
                return_db = self.database.delete_ticket(ticket_number, unity_id)
                if return_db == 'sucess':

                    return jsonify({'message': 'Senha removida da fila.'}), 200
                else:
                    return jsonify({'error': str(return_db[1])}), 400
            else:
                return jsonify({'error': 'Parâmetros não informados.'}), 400  
        else: 
            return jsonify({'error': 'ClientId / Secret are invalid'}), 400     
        
    def refresh_queue(self, unity_id):
        return_database = self.database.refresh_queue(unity_id)
        if return_database == 'sucess':  
            return jsonify({'message': 'Fila de senhas limpa.'}), 200
        else:
            return jsonify({'error': str(return_database[1])}), 400
             
if __name__ == '__main__':

    app = ApiQueue(ip="localhost")
    app.run(port=5000, debug=True)
    
# if __name__ == "__main__":

#     serve(app, host="0.0.0.0", port=5000)