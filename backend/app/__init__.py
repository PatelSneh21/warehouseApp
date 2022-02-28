import os 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, Response
from flask_cors import CORS

# Import routing, models and Start the App
from app import views
app = Flask(__name__)
app.debug = True
regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#db = SQLAlchemy  (app) # flask-sqlalchemy

app.register_blueprint(views.views)	

#The below is an example of how to get environment variables. 
#API keys, password hash salts, etc will be stored as an environment variable and not uploaded to github.
#print(os.environ['PASSWORD_SALT'])

def check(email): #Allows us to determine whether or not a given string is a valid email or not 
    if(re.match(regex, email)):
        return True 
    else:
        return False

#Use this route to test whether or not the backend is running
@app.route('/status', methods=['GET'])
def status():
	print("HELLO")
	return Response(status = 200) 


#Application run stuff, in debug mode for now. TURN DEBUG MODE OFF PRIOR TO PRODUCTION, MAKES APP VULNERABLE 
if __name__ == '__main__':
	app.debug=True
	app.run()