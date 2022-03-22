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
from werkzeug.security import generate_password_hash, check_password_hash
# Import routing, models and Start the App
from app import views

app = Flask(__name__)
app.debug = True
app.permanent_session_lifetime = timedelta(days = 5) #A user who clicks remember me will be logged in for this long
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:@127.0.0.1:3306/mydb"
app.config['SECRET_KEY'] = os.environ.get('PASSWORD_SALT')

regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
salt = os.environ.get('PASSWORD_SALT')

#Database Setup:
db = SQLAlchemy(app) # flask-sqlalchemy
Base = automap_base()
Base.prepare(db.engine, reflect=True)

#Database Setup:
#pulls models by scanning db
Rack_Info = Base.classes.rack_info
Bin_Info = Base.classes.bin_info
Deposits = Base.classes.deposits
class Items(db.Model):
	item_id = db.Column(db.Integer, primary_key = True)
	item_name = db.Column(db.String(120), unique = True, nullable = False)
	model_number = db.Column(db.Integer)
	item_price = db.Column(db.Float)
	quantity = db.Column(db.Integer)
Customers = Base.classes.customers
class Users(db.Model):
	user_id = db.Column(db.Integer, primary_key = True)
	user_username = db.Column(db.String(120), unique = True, nullable = False)
	user_name = db.Column(db.String(120), nullable = False)
	user_type = db.Column(db.String(120), nullable = False)
	user_password = db.Column(db.String(120), nullable = False)

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
	#Handles being POSTed user data from the form
	if request.method == 'POST':
		if "username" in session:
			return Response(status = 300) #User is already logged in, redirect them to dashboard

		username = request.json["username"]
		username = username.lower() #Data cleaning
		name = request.json["name"]
		userType = request.json["userType"]
		password = request.json["password"]
		password_hashed = generate_password_hash(password + salt, method = 'sha256')
		#Input validations to check the data received from the frontend, for the time being generic error 404 is being returned
		if (name == "" or userType == "" or username == "" or password == ""): #No field can be left blank
			return Response(status=404)

		if (Users.query.filter_by(user_username = username).first() is None): #Ensures there is no other user with the same username
			newUser = Users(user_username = username, user_password = password_hashed, user_name = name, user_type = userType)
			db.session.add(newUser)
			db.session.commit()

			session["username"] = username 	
			return Response(status = 202)  #Return a status code 202

		return Response(status = 404) #Username already exists


@app.route('/api/login', methods = ['POST', 'GET'])
def login():
	if "username" in session:
		return Response(status = 300) #User is already logged in, redirect to dashboard

	if request.method == 'POST':

		username = request.json["username"]
		username = username.lower()
		password = request.json["password"]
		sessionPermanance = request.json['rememberMe']

		user = Users.query.filter_by(user_username = username).first()
		if user is None: 
			return Response(status = 404) #User does not exist

		if check_password_hash(user.user_password, password + salt):
			session.permanent = sessionPermanance			 		
			session["username"] = user.user_username
			return Response(status = 200) #Redirect to dashboard

		return Response(status = 404) #Incorrect Password

	#Our GET Request so that users can access the login page
	return Response(status = 200)

#Log a user out
@app.route('/api/logout')
def logout():
	if "username" in session is None:
		return Response(status = 300) #Send user back to homepage if they aren't logged in
	else: 
		session.pop("username", None)
		return Response(status = 200) 


@app.route('/api/isLoggedIn', methods = ['GET'])
def isLoggedIn():
	user = {}
	print("Hello1")
	if ("username" in session):

		current_user = Users.query.filter_by(user_username = session["username"]).first()
		user = {
			"username": current_user.user_username,
			"userType": current_user.user_type
		}
		return user, 200
	else:
		return Response(status=201)


@app.route('/api/addItem', methods = ['POST'])
def addItem():
	if "username" in session is None:
		return Response(status=404)

	else:
		item_name = request.json["item_name"]
		model_number = request.json["model_number"]
		item_price = request.json['item_price']
		quantity = request.json["quantity"]

		newItem = Items(item_name = item_name, model_number = model_number, item_price = item_price, quantity = quantity)
		db.session.add(newItem)
		db.session.commit()
		return Response(status=200)

#Application run stuff, in debug mode for now. TURN DEBUG MODE OFF PRIOR TO PRODUCTION, MAKES APP VULNERABLE 
if __name__ == '__main__':
	app.debug=True
	app.run()