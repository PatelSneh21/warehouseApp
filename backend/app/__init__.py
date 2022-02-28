import os 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, Response
from flask_cors import CORS
from datetime import datetime, timedelta, time, date

# Import routing, models and Start the App
from app import views
app = Flask(__name__)
app.debug = True
app.permanent_session_lifetime = timedelta(days = 5) #A user who clicks remember me will be logged in for this long
regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#db = SQLAlchemy  (app) # flask-sqlalchemy

app.register_blueprint(views.views)	

#The below is an example of how to get environment variables. 
#API keys, password hash salts, etc will be stored as an environment variable and not uploaded to github.
#print(os.environ['PASSWORD_SALT'])


#Use this route to test whether or not the backend is running
@app.route('/status', methods=['GET'])
def status():
	print("HELLO")
	return Response(status = 200) 


#Application run stuff, in debug mode for now. TURN DEBUG MODE OFF PRIOR TO PRODUCTION, MAKES APP VULNERABLE 
if __name__ == '__main__':
	app.debug=True
	app.run()