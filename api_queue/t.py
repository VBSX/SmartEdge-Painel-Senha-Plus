import requests
url = r'http://localhost:5000/queue'
# payload = """name=aaa,
# document_number=123,
# type_ticket=1,
# priority=1,
# service_type=1,
# unity_id=1,
# type_emission=1,
# client_secret=1,
# client_id=1
# """
# headers = {
# 'Content-Type': 'application/x-www-form-urlencoded'
# }
# response =requests.request("POST", url, headers=headers, data=payload)
# print(response.text)


response =requests.request("GET", url)
print(response.text)