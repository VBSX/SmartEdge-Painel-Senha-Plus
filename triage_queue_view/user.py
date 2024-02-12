
import os
import sys
path = os.path.abspath('./')
sys.path.append(path)
from api_queue.database.database import Database

class User():
    def __init__(self, name):
        self.db = Database()
        self.username = name

        self.return_db = self.get_user_data()
        
    def get_user_data(self):
        return_db, user = self.db.get_all_info_of_user(self.username)
        if return_db == 'sucess' and user:
            user = user[0]
            self.user_id = user[0]
            self.name = user[1]
            self.last_name = user[2]
            self.password = user[4]
            self.user_role = user[5]
            self.api_id = user[6]
            self.api_secret = user[7]
            self.status = user[8]
            self.last_unity = user[9]
            return_db, unitys = self.db.get_all_unity_user_have_acess(self.user_id)
            if return_db == 'sucess' and unitys:
                self.unitys = unitys
            
        return return_db
    
    
    def update_unity_used(self, unity_id):
        return_db = self.db.update_unity_of_user(self.user_id, unity_id)
        if return_db == 'sucess':
            self.last_unity = unity_id
        return return_db
    
    
if __name__ == '__main__':
    user  = User('admin')
   
    print(user.name)
    print(user.last_name)
    print(user.user_id)
    print(user.status)
    print(user.password, user.return_db)
    print(user.user_role)
    print(user.last_unity)
    print(user.unitys)
    
