from flask import (
    Flask,
    request,
    render_template,
    redirect,
    send_from_directory,
    url_for,
    session,
    jsonify
    )
import requests
import os
import sys
path = os.path.abspath('./')
sys.path.append(path)
from triage_queue_view.user import User
from api_queue.database.database import Database
from flask import jsonify
class TriageQueue(Flask):
    def __init__(self,ip):
        super().__init__(__name__)
        self.database = Database()
        self.ip = ip
        self.url_api_get_queue = f"http://{self.ip}:5000/queue"
        self.url_call_api = f"http://{self.ip}:5000/call"
        self.static_dir = '/static'
        self.config['SEND_FILE_MAX_AGE_DEFAULT'] = 300
        self.config['SECRET_KEY'] = 'My_Nice_secret_key'
        #Rota para servir o arquivo de imagem do favicon
        self.route('/favicon.ico')(self.favicon)
        self.route('/queue', methods=['GET'])(self.view_queue)
        self.route('/call', methods=['POST'])(self.call_in_panel_view)
        self.route('/delete_queue', methods=['POST'])(self.delete_queue)
        self.route('/login', methods=['GET', 'POST'])(self.login)
        self.route('/logout', methods=['GET'])(self.logout)
        self.route('/config', methods=['GET', 'POST'])(self.config_view)
        self.route('/config/unit', methods=['GET'])(self.get_all_unitys)
        self.route('/config/unit', methods=['POST'])(self.update_unit)
        self.route('/config/unit', methods=['DELETE'])(self.delete_unit)
        self.route('/', methods=['GET', 'POST', 'UPDATE'])(self.index)

    def favicon(self):
        return send_from_directory('static', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    def queue_add(self,name, document):
        if 'username' in session:
            name = f'name={name}'
            last_unity_used = session['last_unity']
            api_secret = session['api_secret']
            api_id = session['api_id']
            
            document_number = f'&document_number={document}'
            type_ticket = '&type_ticket=ticket_by_name'
            priority = f'&priority=1'
            service_type = f'&service_type=1'
            unity_id = f'&unity_id={last_unity_used}'
            type_emission = f'&type_emission=service_desk'
            client_secret = f'&client_secret={api_secret}'
            client_id = f'&client_id={api_id}'
            payload = name + document_number + type_ticket + priority + service_type  + unity_id + type_emission + client_secret + client_id
            headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
            return requests.request("POST", self.url_api_get_queue, headers=headers, data=payload)
        else:
            return redirect(url_for('login'))
        
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
        if 'username' in session:
            last_unity_used = session['last_unity']
            url = f"{self.url_api_get_queue}?unity_id={last_unity_used}"
            response = requests.request("GET", url)
            if response.status_code == 200:
                queue = response.json()
                actual_unity = session['last_unity']
                units = session['unitys']
                name_actual_unity = session['name_last_unity']
                # ajustar a questão do guiche atendimento e a unidade atual
                return render_template(
                    'queue.html',
                    actual_unity=actual_unity,
                    units=units,
                    name_actual_unity=name_actual_unity,
                    queue_data=queue,
                    id_guiche=1,
                    unity_id = actual_unity
                    )
            else:
                return render_template('index.html')
        else:
            return redirect(url_for('login'))
        
    def call_in_panel_view(self):
        if 'username' in session:
            if request.method == 'POST':
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
        else:
            return redirect(url_for('login'))
        
    def index(self):
        """
        Configuração da página inicial (Index)
        """
        if 'username' in session:
            
            if request.method == 'POST' and request.form.get('update_button'):
                new_unity = request.form['new_unity']
                self.set_new_unity_used(new_unity)
                return 'atualizado', 200
            
            elif request.method == 'POST':
                nome = request.form['nome']
                documento = request.form['documento']
                emission_ticket = self.queue_add(nome, documento)
                if emission_ticket.status_code == 200:
                    return render_template('index.html', sucesso=True, nome=nome)
                else:
                    erro = emission_ticket.json()['error']
                    sucesso = False
                    return render_template('index.html', sucesso=sucesso, nome=nome, erro=erro)

            elif request.method == 'GET':
                sucesso = False
                erro = None
                nome = None
                actual_unity = session['last_unity']
                units = session['unitys']
                name_actual_unity = session['name_last_unity']
                
                return render_template('index.html', sucesso=sucesso, nome=nome, erro=erro, actual_unity=actual_unity,
                                    units=units, name_actual_unity=name_actual_unity)
        else:
            return redirect(url_for('login'))


     
    def delete_queue(self):
        if 'username' in session:
            name = request.form['name']
            ticket_document_number = request.form['document_number']
            ticket_number = request.form['ticket_number']
            payload=f'name={name}&document_number={ticket_document_number}&ticket_number={ticket_number}'
            headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
            requests.request(method="DELETE",url=self.url_api_get_queue, headers=headers, data=payload)
            return redirect(url_for('view_queue'))
        else:
            return redirect(url_for('login'))
    
    def login (self):
        if 'username' in session:
            return redirect(url_for('index'))
        else:
            if request.method == 'POST':
                username = request.form['username']
                password = request.form['password']
                user = User(username)
                if self.verify_if_password_is_ok(user.return_db,user.password,password):
                    # if self.crypter.decrypt(password, user.password):
                    session['username'] = username
                    session['user_id'] = user.user_id
                    session['user_name'] = user.name
                    session['last_name'] = user.last_name
                    session['user_role'] = user.user_role
                    session['status'] = user.status
                    session['last_unity'] = user.last_unity
                    session['unitys'] = user.unitys
                    session['api_id'] = user.api_id
                    session['api_secret'] = user.api_secret
                    session['name_last_unity'] = user.name_last_unity
                    print(session)
                    return redirect(url_for('index'))
                else:
                    return render_template('login.html', error=True, msg_error = 'Usuário ou senha incorretos')   
            else:
                return render_template('login.html')

    def verify_if_password_is_ok(self, return_db, password_db, password):
        if return_db == 'sucess' and password_db:
            print(password_db)
            if password_db[0][0] == password:
                return True
            else:
                return False
        else: 
            return False
        
    def logout(self):
        session.pop('username', None)
        return redirect(url_for('login'))
    
    def config_view(self):
        if 'username' in session:
            if request.method == 'POST':
                # configurações referente ao sistema, como criar novos usuários, alterar permissões
                # alterar senhas dos usuários, etc.
                return redirect(url_for('config'))
            else:
                return render_template('config.html')
        else:
            return redirect(url_for('login'))
    

    def set_new_unity_used(self, unity_id):
        user = User(session['username'])
        user.update_unity_used(unity_id)
        session['last_unity'] = user.last_unity
        session['name_last_unity'] = user.name_last_unity
        
    def get_all_unitys(self):
        return_db, unitys = self.database.get_all_units_info()
        if return_db == 'sucess':
            return unitys
    
    def update_unit(self):
        if 'username' in session:
            if request.method == 'POST':
                type_post = request.form['type_post']
                
                unity_name = request.form['unity_name']
                unity_address = request.form['unity_address']
                unity_phone = request.form['unity_phone']
                unity_email = request.form['unity_email']
                if type_post == 'update_unit':
                    unity_id = request.form['unity_id']
                    return self.update_db_unit(unity_id,unity_name, unity_address, unity_phone, unity_email)
                elif type_post == 'new_unit':
                    return self.add_new_unit(unity_name, unity_address, unity_phone, unity_email)
            else:
                return redirect(url_for('config'))      
        else:
            return redirect(url_for('login'))
            
    def update_db_unit(self, unity_id,unity_name, unity_address,unity_phone,unity_email ):
        return_db = self.database.update_unit_info(unity_id,unity_name, unity_address, unity_phone, unity_email)
        if return_db == 'sucess':
            return jsonify(return_db),  200
        else:
            return jsonify(return_db), 400
   
    def add_new_unit(self, unity_name, unity_address, unity_phone, unity_email):
        return_db = self.database.add_new_unit( unity_name, unity_address, unity_phone, unity_email)
        print(return_db)
        return self.handle_return_db(return_db)
    
    def delete_unit(self):
        if request.method == 'DELETE':
            unity_id = request.form['unity_id']
            return_db = self.database.delete_unit(unity_id)
            return self.handle_return_db(return_db)
        
    def handle_return_db(self, return_db):
        if return_db == 'sucess':
            return jsonify(return_db), 200
        else:
            return jsonify(str(return_db)), 400
    
    
    
if __name__ == '__main__':
    app = TriageQueue(ip="localhost")
    app.run(port=5002, debug=True)
# if __name__ == "__main__":

#     serve(app, host="0.0.0.0", port=5001)