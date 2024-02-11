from flask import (
    Flask,
    request,
    render_template,
    redirect,
    send_from_directory,
    url_for)
import requests


class TriageQueue(Flask):
    def __init__(self,ip):
        super().__init__(__name__)
        self.ip = ip
        self.url_api_get_queue = f"http://{self.ip}:5000/queue"
        self.url_call_api = f"http://{self.ip}:5000/call"
        self.static_dir = '/static'
        self.config['SEND_FILE_MAX_AGE_DEFAULT'] = 300
        #Rota para servir o arquivo de imagem do favicon
        self.route('/favicon.ico')(self.favicon)
        self.route('/queue', methods=['GET'])(self.view_queue)
        self.route('/call', methods=['POST'])(self.call_in_panel_view)
        self.route('/delete_queue', methods=['POST'])(self.delete_queue)
        self.route('/', methods=['GET', 'POST'])(self.index)

    def favicon(self):
        return send_from_directory('static', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    def queue_add(self,name, document):
        name = f'name={name}'
        document_number = f'&document_number={document}'
        type_ticket = '&type_ticket=ticket_by_name'
        priority = f'&priority=1'
        service_type = f'&service_type=1'
        unity_id = f'&unity_id=1'
        type_emission = f'&type_emission=service_desk'
        client_secret = f'&client_secret=1'
        client_id = f'&client_id=1'
        payload = name + document_number + type_ticket + priority + service_type  + unity_id + type_emission + client_secret + client_id
        headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
        return requests.request("POST", self.url_api_get_queue, headers=headers, data=payload)
        
    def view_queue(self):
        """
            ele irá fazer a chamada na api que retornará os dados:
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
        url = f"{self.url_api_get_queue}?unity_id=1"
        response = requests.request("GET", url)
        if response.status_code == 200:
            queue = response.json()
            # ajustar a questão do guiche atendimento e a unidade atual
            return render_template('queue.html', queue_data=queue, id_guiche=1, unity_id = 1)
        else:
            return render_template('index.html')
        
    def call_in_panel_view(self):
        unity_id = request.form['unity_id']
        ticket_number = request.form['ticket_number']
        service_desk = request.form['service_desk']
        print(unity_id, ticket_number, service_desk)
        payload=f'unity_id={unity_id}&ticket_number={ticket_number}&service_desk={service_desk}'
        headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
        requests.request("POST", self.url_call_api, headers=headers, data=payload)
        return redirect(url_for('view_queue'))
        
    def index(self):
        """
        Configuração da página inicial(Index)
        
        """
        if request.method == 'POST':
            nome = request.form['nome']
            documento = request.form['documento']
            emission_ticket = self.queue_add(nome,documento)
            if emission_ticket.status_code == 200:
                return render_template('index.html', sucesso=True, nome=nome)
            else:
                erro = emission_ticket.json()
                erro = erro['error']
                return render_template('index.html', sucesso=False, nome=nome, erro=erro)
        return render_template('index.html')

    def delete_queue(self):
        name = request.form['name']
        ticket_document_number = request.form['document_number']
        ticket_number = request.form['ticket_number']
        payload=f'name={name}&document_number={ticket_document_number}&ticket_number={ticket_number}'
        headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
        requests.request(method="DELETE",url=self.url_api_get_queue, headers=headers, data=payload)
        return redirect(url_for('view_queue'))
    
if __name__ == '__main__':
    app = TriageQueue(ip="localhost")
    app.run(port=5002, debug=True)
# if __name__ == "__main__":

#     serve(app, host="0.0.0.0", port=5001)