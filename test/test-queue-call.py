import requests
from time import sleep


def criar_senha():
    
    url = "http://localhost:5000/queue"
    """
        payload='name=cleber&document_number=123'
        headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        print(response.text)
    """
    headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    }

        
    payload='type_ticket=ticket_by_number&priority=8&service_type=1&unity_id=1&type_emission=totem&client_secret=1&client_id=1'

    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)

    
def chamar_senha():
    url = "http://localhost:5000/call"

    payload='name=cleber&document_number=123'
    headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
    
criar_senha()

#chamar_senha()
sleep(2)
    
    
