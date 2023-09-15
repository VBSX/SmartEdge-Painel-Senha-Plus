from flask import (
    Flask,
    request,
    Response,
    send_from_directory,
    render_template,
    redirect,
    make_response,
    session)
from time import sleep
import os
import sys

path = os.path.abspath('./')
sys.path.append(path)
from api_queue.database.database import Database
from flask import jsonify

class DisplayApp(Flask):
    def __init__(self, name, ticket_number, service_desk, service_type, unity_id, secretkey):
        super().__init__(__name__)
        self.secret_key= secretkey
        
        self.name = name
        self.ticket_number = ticket_number
        self.service_desk = service_desk
        self.service_type = service_type
        self.unity_id = unity_id

        
        self.db = Database()
        
        self.static_dir = '/static'
        self.config['SEND_FILE_MAX_AGE_DEFAULT'] = 300
        self.route('/favicon.ico')(self.favicon)
        self.route('/display')(self.send_content)
        self.route('/static/<path:filename>')(self.serve_static)
        self.route('/display', methods=['POST'])(self.display_content)
        self.route('/display/painel')(self.painel_exibicao)
        self.route('/display/painel/configserver', methods=['POST'])(self.configserver)
        self.route('/display/painel/configunity', methods=['POST'])(self.configunity)
        self.route('/display/painel/getunitys', methods=['GET'])(self.getunitys)
        self.route('/')(self.index_redirect)

    def favicon(self):
        return send_from_directory('static', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    def send_content(self):
        def generate():
            while True:
                content = f'{self.name}:{self.ticket_number}:{self.service_desk}:{self.service_type}:{self.unity_id}:\n'
                sleep(0.7)
                yield f"data: {content}\n\n"
        sleep(0.1)
        response = Response(generate(), mimetype="text/event-stream")
        response.headers['Cache-Control'] = 'no-cache'
        return response

    def serve_static(self, filename):
        return send_from_directory(self.static_dir, filename)

    def display_content(self):
        data = request.json
        self.name = data.get('name')
        self.ticket_number = data.get('ticket_number')
        self.service_desk = data.get('service_desk')
        self.service_type = data.get('service_type')
        self.unity_id = data.get('unity_id')
        
        return '', 200

    def painel_exibicao(self):
        return render_template('painel_exibicao.html')

    def index_redirect(self):
        return redirect('/display/painel')
    
    def configserver(self):
        host = request.form['host']
        user = request.form['usuario']
        password = request.form['senha']
        client_id = request.form['clientId']
        client_secret = request.form['clientSecret']
        
        if self.verify_if_is_data_is_valid(user, password, client_id, client_secret):
            # Configurar um cookie com as configurações
            response = make_response('Configurações do servidor salvas com sucesso!')

            # Defina os cookies das configurações
            response.set_cookie('host', host)
            response.set_cookie('usuario', user)
            response.set_cookie('clientId', client_id)
            response.set_cookie('clientSecret', client_secret)

            # Configurar o cookie 'autenticado' para indicar que o cliente está autenticado
            response.set_cookie('autenticado', 'True')
            session['usuario'] = user
            session['clientId'] = client_id
            session['clientSecret'] = client_secret
            session['autenticado'] = True
            
            return response, 200
        else:
            return '', 401
        
    def verify_if_is_data_is_valid(self, user, password, clientId, clientSecret):
        user_info, column_indices = self.db.get_all_info_user(user)
        password_db = user_info[0][column_indices['Senha']]
        
        has_autentication_api = self.db.client_id_and_client_secret_api(clientId, clientSecret)
        has_autentication_api = has_autentication_api[0]
        if password_db == password and has_autentication_api:
            return True
        else:
            return False
        
        
    def getunitys(self):
        all_unitys = self.db.get_all_unitys()
        
        # Inicialize uma lista vazia para armazenar as unidades
        unity_list = []
        
        for unity in all_unitys:
            unity_id = unity[0]
            unity_name = unity[1]
            
            unity_info = {
                'unity_id': unity_id,
                'unity_name': unity_name
            }
            
            unity_list.append(unity_info)
            
        status_code = 200
        
        return jsonify(unity_list) , status_code

    def configunity(self):
        unity_id = request.form['unity_id']
        unity_name = request.form['unity_name']
        client_secret = request.form['client_secret']
        client_id = request.form['client_id']
        
        if session['autenticado'] == True and session[
            'clientId'] == client_id and session['clientSecret'] == client_secret:
            # Configurar um cookie com as configuraçães
            response = make_response('Configuraçães do servidor salvas com sucesso!')

            # Defina os cookies das configuraçães
            response.set_cookie('unity_id', unity_id)
            response.set_cookie('unity_name', unity_name)
            response.set_cookie('unity_configured', True)
            # Configurar o cookie 'autenticado' para indicar que o cliente está autenticado
            response.set_cookie('autenticado', 'true')
            session['unity_id'] = unity_id
            session['unity_name'] = unity_name
            session['autenticado'] = True
            
            return response, 200
        else:
            return '', 401
  
if __name__ == '__main__':
    app = DisplayApp('', '','', '', '', 'asasdsaas465465')

    app.verify_if_is_data_is_valid('admin', '1', '1', '1')
    app.run(port=5001, debug=True)