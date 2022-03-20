import os 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, make_response, session, Response
from flask_cors import CORS
from datetime import datetime, timedelta, time, date
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from re import S
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from numpy import quantile
from sqlalchemy.ext.automap import automap_base
# Import routing, models and Start the App
from app import views

app = Flask(__name__)
app.debug = True
app.permanent_session_lifetime = timedelta(days = 5) #A user who clicks remember me will be logged in for this long
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:@127.0.0.1:3306/mydb"

regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

#Database Setup:
db = SQLAlchemy(app) # flask-sqlalchemy
Base = automap_base()
Base.prepare(db.engine, reflect=True)

#Database Setup:
#pulls models by scanning db
Rack_Info = Base.classes.rack_info
Bin_Info = Base.classes.bin_info
Deposits = Base.classes.deposits
Items = Base.classes.items
Customers = Base.classes.customers
class Users(db.Model):
	user_id = db.Column(db.Integer, primary_key = True)
	user_name = db.Column(db.String(120), unique = True, nullable = False)
	user_type = db.Column(db.String(120), nullable = False)
Sales = Base.classes.sales
Samples = Base.classes.samples
Master_Cartons = Base.classes.master_cartons


#The below is an example of how to get environment variables. 
#API keys, password hash salts, etc will be stored as an environment variable and not uploaded to github.
#print(os.environ['PASSWORD_SALT'])

#Register other routes
app.register_blueprint(views.views)


#Use this route to test whther or not the backend is running
@app.route('/status', methods=['GET'])
def status():
	print("Application Server Running")
	#Application database connection testing
	# new_item = Rack_Info(rack_location = "Hello123") #Creates the object to add into the db
	# db.session.add(new_item) #Adds the object to the db
	# db.session.commit() #Saves the object to the db
	return Response(status = 200) 


#Signup a new user
@app.route('/api/signup', methods =['GET', 'POST'])
def signup():
	if "email" in session:
		return Response(status = 300) #User is already logged in, redirect them to dashboard
	#Handles being POSTed user data from the form
	if request.method == 'POST':
		#email = request.json["email"]
		#email = email.lower()
		name = request.json["name"]
		userType = request.json["userType"]

		#Input validations to check the data received from the frontend, for the time being generic error 404 is being returned
		if (name == "" or userType == ""): #No field can be left blank
			return Response(status=404)
		#if not check(email): #The provided email should be a valid email 
		#	return Response(status=404)

		if (Users.query.filter_by(user_name = name).first() is None):
			newUser = Users(user_name = name, user_type = userType)
			db.session.add(newUser)
			db.session.commit()	
			#session["email"] = email  #Log the user in
			return Response(status = 202)  #Return a status code 202
		return Response(status = 404) #Email already exists

	#Our GET Request
	return Response(status = 200)


#Application run stuff, in debug mode for now. TURN DEBUG MODE OFF PRIOR TO PRODUCTION, MAKES APP VULNERABLE 
if __name__ == '__main__':
	app.debug=True
	app.run()