import os 
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, make_response, session, Response
from flask_cors import CORS
from datetime import datetime, timedelta, time, date
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from re import S
from sqlalchemy import desc
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from numpy import quantile
from sqlalchemy.ext.automap import automap_base
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session, SqlAlchemySessionInterface
# Import routing, models and Start the App
from app import views

app = Flask(__name__)

# CHANGE ORIGIN URL HERE
CORS(app)
#CORS(app, supports_credentials=True, allow_headers='Content-Type', origin='http://ec2-54-83-68-204.compute-1.amazonaws.com:3000/')
app.debug = True
app.permanent_session_lifetime = timedelta(days = 5) #A user who clicks remember me will be logged in for this long

#UNCOMMENT THIS FOR WINDOWS/MAYBE LINUX
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:root@0.0.0.0:3306/mydb"

#UNCOMMENT THIS FOR MAC
# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:root@127.0.0.1:3306/mydb"
# app.config['SECRET_KEY'] = os.environ.get('PASSWORD_SALT')
app.config['SECRET_KEY'] = 'temp'


regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'	
#<<<<<<< HEAD	
salt = os.environ.get('PASSWORD_SALT')	
# salt = os.environ.get('PASSWORD_SALT')	
salt = "temp"	
#>>>>>>> e2330e278ae06176edb96119ca51ef2d7fe0483f

#Database Setup:
db = SQLAlchemy(app) # flask-sqlalchemy

# Base = automap_base()
# Base.prepare(db.engine, reflect=True)

#Database Setup:
#Defines all the tables in the db, used in running SQLAlchemy Queries
itemLocations = db.Table('itemLocations',
	db.Column('bin_id', db.Integer, db.ForeignKey('Bin.bin_id'), primary_key = True),
	db.Column('item_id', db.Integer, db.ForeignKey('Items.item_id'), primary_key = True)
	)

class Rack(db.Model):
	__tablename__ = 'Rack'
	rack_id = db.Column(db.Integer, primary_key = True)
	rack_location = db.Column(db.String(120))

class Bin(db.Model):
	__tablename__ = 'Bin'
	bin_id = db.Column(db.Integer, primary_key = True)
	bin_height = db.Column(db.Integer)
	bin_location = db.Column(db.String(120))
	rack_info_rack_id = db.Column(db.Integer, db.ForeignKey('Rack.rack_id'))
	itemsIn = db.relationship('Items', secondary = itemLocations, backref = db.backref('binContainingItems'))

class Deposits(db.Model):
	__tablename__ = 'Deposits'
	deposit_id = db.Column(db.Integer, primary_key = True)
	deposit_date = db.Column(db.Date())
	item_id = db.Column(db.Integer, db.ForeignKey('Items.item_id'))
	num_cartons = db.Column(db.Integer)
	bin_info_bin_id = db.Column(db.Integer, db.ForeignKey('Bin.bin_id'))	
	rack_info_rack_id = db.Column(db.Integer, db.ForeignKey('Rack.rack_id'))

class Items(db.Model):
	__tablename__ = 'Items'
	item_id = db.Column(db.Integer, primary_key = True)
	item_name = db.Column(db.String(120), unique = True, nullable = False)
	model_number = db.Column(db.String(120))
	item_price = db.Column(db.Float)
	quantity = db.Column(db.Integer)
	# bin_location = db.relationship('Bin', secondary = itemLocations, backref = db.backref(('itemInBin'), lazy = 'dynamic'))

class Customers(db.Model):
	__tablename__ = 'Customers'
	customer_id = db.Column(db.Integer, primary_key = True)
	customer_name = db.Column(db.String(120), unique = True, nullable = False)

class Users(db.Model):
	__tablename__ = 'Users'
	user_id = db.Column(db.Integer, primary_key = True)
	user_username = db.Column(db.String(120), unique = True, nullable = False)
	user_name = db.Column(db.String(120), nullable = False)
	user_type = db.Column(db.String(120), nullable = False)
	user_password = db.Column(db.String(120), nullable = False)

class Sales(db.Model):
	__tablename__ = 'Sales'
	transaction_id = db.Column(db.Integer, primary_key = True)
	transaction_date = db.Column(db.Date(), default = datetime.now().date())
	item_amount = db.Column(db.Integer)
	tax_collected = db.Column(db.Float)
	revenue = db.Column(db.Float)
	items_item_id = db.Column(db.Integer, db.ForeignKey('Items.item_id'))
	bin_info_bin_id = db.Column(db.Integer, db.ForeignKey('Bin.bin_id'))
	rack_info_rack_id = db.Column(db.Integer, db.ForeignKey('Rack.rack_id'))
	customers_customer_id = db.Column(db.Integer, db.ForeignKey('Customers.customer_id'))
	users_user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))

class Samples(db.Model):
	__tablename__ = 'Samples'
	sample_id = db.Column(db.Integer, primary_key = True)
	withdraw_date = db.Column(db.Date(), default = datetime.now().date())
	item_amount = db.Column(db.Integer)
	items_item_id = db.Column(db.Integer, db.ForeignKey('Items.item_id'))
	bin_info_bin_id = db.Column(db.Integer, db.ForeignKey('Bin.bin_id'))
	rack_info_rack_id = db.Column(db.Integer, db.ForeignKey('Rack.rack_id'))
	users_user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))

class Master_Cartons(db.Model):
	__tablename__ = 'Master_Cartons'
	carton_id = db.Column(db.Integer, primary_key = True)
	carton_size = db.Column(db.String(120), nullable = False)
	num_items = db.Column(db.Integer, nullable = False)
	items_item_id = db.Column(db.Integer, db.ForeignKey('Items.item_id'))


#The below is an example of how to get environment variables. 
#API keys, password hash salts, etc will be stored as an environment variable and not uploaded to github.
#print(os.environ['PASSWORD_SALT'])

#Register other routes
app.register_blueprint(views.views)


# Route: /status, Used to check whether or not the flask webserver is running
# Method: GET
# Expected Response: HTTP Status 200
@app.route('/status', methods=['GET'])
def status():
	print("Application Server Running")
	return Response(status = 200) 


# Route: /api/signup, Used to sign up a user into the system
# Method: GET
# Expected Response: User added to database, user added to session, status code 202 (Created object)
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


# Route: /api/login, Used to login an existing user 
# Method: GET
# Expected Response: User added to session, HTTP Response Code 200
@app.route('/api/login', methods = ['POST', 'GET'])
def login():
	# if request.method == 'OPTIONS':
	# 	resp = Response()
	# 	resp.headers['Access-Control-Allow-Origin'] = "http://localhost:3000/"
	# 	resp.headers['Access-Control-Allow-Credentials'] = 'true'
	# 	resp.headers['Access-Control-Allow-Headers'] = "Content-Type"

	# 	return resp
	if "username" in session:
		return Response(status = 300) #User is already logged in, redirect to dashboard

	if request.method == 'POST':

		username = request.json["username"]
		username = username.lower()
		password = request.json["password"]
		sessionPermanance = request.json['rememberMe']
		# success = 404

		user = Users.query.filter_by(user_username = username).first()
		if user is None: 
			return Response(status = 404) #User does not exist

		if check_password_hash(user.user_password, password + salt):
			session.permanent = sessionPermanance			 		
			session["username"] = user.user_username
			return Response(status = 200) #Redirect to dashboard
			

		return Response(status = 404) #Incorrect Password


		# res['actionSuccess'] = False
		# js = json.dumps(res)

		# resp = Response(js, status=success, mimetype='application/json')        
		# resp.headers['Access-Control-Allow-Origin'] = clientUrl
		# resp.headers['Access-Control-Allow-Credentials'] = 'true'
		# resp.headers['Access-Control-Allow-Headers'] = "Content-Type"
		

		# return resp
	#Our GET Request so that users can access the login page
	return Response(status = 200)


# @bp.route('/login', methods=('POST','OPTIONS'))
# def login():
#     if request.method == 'OPTIONS':
#         resp = Response()
#         resp.headers['Access-Control-Allow-Origin'] = clientUrl
#         resp.headers['Access-Control-Allow-Credentials'] = 'true'
#         resp.headers['Access-Control-Allow-Headers'] = "Content-Type"

#         return resp
#     else:

#         '''
#         use session for something  
#         '''  

#         res['actionSuccess'] = False
#         js = json.dumps(res)

#         resp = Response(js, status=200, mimetype='application/json')        
#         resp.headers['Access-Control-Allow-Origin'] = clientUrl
#         resp.headers['Access-Control-Allow-Credentials'] = 'true'
#         resp.headers['Access-Control-Allow-Headers'] = "Content-Type"

#         return resp

# Route: /api/logout
# Method: GET
# Expected Response: Remove a user from the flask-session, HTTP Status 200
@app.route('/api/logout')
def logout():
	if "username" in session is None:
		return Response(status = 300) #Send user back to homepage if they aren't logged in
	else: 
		session.pop("username", None)
		return Response(status = 200) 

# Route: /api/deleteUser
# Method: POST
# Expected Response: Remove a user from the database, HTTP Status 200
@app.route('/api/deleteUser', methods = ['DELETE'])
def deleteUser():
	toDelete = Users.query.filter_by(user_username="UserTest").first()
	db.session.delete(toDelete)
	db.session.flush()
	db.session.commit()
	return Response(status=200)

# Route: /api/isLoggedIn, Return user data if a user is logged in from a session
# Method: GET
# Expected Response: User name and type, HTTP Status 200
@app.route('/api/isLoggedIn', methods = ['GET'])
def isLoggedIn():
	user = {}
	print(session)
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()
		user = {
			"username": current_user.user_username,
			"userType": current_user.user_type
		}
		return user, 200
	else:
		return Response(status=404)


# Route: /api/addItem, Add an item to the database
# Method: POST
# Requested Data:
#	item_name: String
#	model_number: String
#	item_price: Decimal
#	quantity: Integer
# Expected Response: HTTP Status 200
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

		# itemLocation = Bin.query.filter_by(bin_location = request.json["bin_id"]).first()
		# if itemLocation != None: 
		# 	newItem.bin_location.append(itemLocation)
		db.session.add(newItem)
		db.session.commit()
		return Response(status=200)


# Route: /api/admin/allUsers, Get a list of users in the system
# Method: GET
# Expected Response: HTTP Status 200
@app.route('/api/admin/allUsers')
def allUsers(): 
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()
		if (current_user.user_type != "Admin"): #Ensure only admins can see list of all users
			return Response(status=404)
		else:	
			users = Users.query.all()
			print(users)
				
			return 200
	else:
		return Response(status=404)


# Route: /api/admin/allItems, Get a list of items in the system
# Method: GET
# Expected Response: HTTP Status 200
# @app.route('/api/allItems')
# def allItems(): 
# 	print(session)
# 	if ("username" in session):
# 		current_user = Users.query.filter_by(user_username = session["username"]).first()
# 		items = []
# 		for item in Items.query.all():
# 			items.append({
# 				'Item Name' : item.item_name,
# 				'Item Model Num': item.model_number,
# 				'Item Quantity' : item.quantity
# 				}) 
# 		return {
# 			"items" : items
# 		}, 200

# 	else:
# 		return Response(status=404)

@app.route('/api/allItems', methods = ['POST'])
def allItems(): 
	username = request.json["username"]
	username = username.lower()
	user = Users.query.filter_by(user_username = username).first()
	if user is None: 
		return Response(status = 404) #User does not exist
	items = []
	for item in Items.query.all():
		items.append({
			'Item Name' : item.item_name,
			'Item Model Num': item.model_number,
			'Item Quantity' : item.quantity
			}) 
	return {
		"items" : items
	}, 200


# Route: /api/searchItem/<query>, Returns all items that match the model_number or item_name
# Method: GET
# Param: query
# Expected Response: HTTP Status 200
@app.route('/api/searchItemModel/<query>')
def searchItem(query):
	items = []
	for item in Items.query.all():
		if (str(item.model_number) == query) or (str(item.item_name) == query):
			items.append({
                'Item Name' : item.item_name,
                'Item Model Num': item.model_number,
                'Item Quantity' : item.quantity
                })
	return {
        "items" : items
    }, 200

# Route: /api/findItem/<model_num>, Get a list of locations of items in the system
# Method: GET
# Param: model_num
# Expected Response: HTTP Status 200
@app.route('/api/findItem/<model_num>')
def findItem(model_num):
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()
		item = Items.query.filter_by(model_number = model_num).first() 

		binsFound = []
		for location in itemLocations.query.filter_by(item_id = item.item_id).all():
			curr = Bin.query.filter_by(bin_id = location.bin_id)
			binsFound.append({
				"bin_id" : curr.bin_id,
				"bin_location" : curr.bin_location
				})
		return { 
			"binsFound" : binsFound
			}, 200
	else: 
		return Response(status=404) 


# Route: /api/addMasterCarton, Add a MasterCarton to the database
# Method: POST
# Requested Data:
#	carton_size: Integer
#	num_items: Integer
#	item_id: Integer
# Expected Response: HTTP Status 200
@app.route('/api/addMasterCarton', methods = ['POST'])
def addMasterCarton():
	if "username" in session is None:
		return Response(status=404)

	else:
		carton_size = request.json["carton_size"]
		num_items = request.json["num_items"]
		item_id = request.json['item_id']
		newMC = Master_Cartons(carton_size = carton_size, num_items = num_items, items_item_id = item_id)

		db.session.add(newMC)
		db.session.commit()
		return Response(status=200)


# Route: /api/withdraw, Remove a quantity of items from the database
# Method: POST
# Requested Data:
#	item_id: Integer
#	quantity: Integer
#	item_id: Integer
# Expected Response: HTTP Status 200
@app.route('/api/withdraw', methods = ['POST'])
def withdraw(item_id): 
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()

		item_id = request.json["item_id"]
		quantity = request.json["quantity"]

		MC = Master_Cartons.query.filter_by(items_item_id = item_id)
		itemToWithdraw = Items.query.filter_by(item_id = item_id).first()

		if (quantity >= MC.num_items and quantity >= itemToWithdraw.quantity):
			itemToWithdraw.quantity = itemToWithdraw.quantity - quantity 
			db.session.merge(itemToWithdraw)
			db.session.flush()
			db.session.commit()
			return Response(status=200) #Withdrawal successful

		else:
			return Response(status=400) #Client error, bad quantity to withdraw. Cannot withdraw more than master carton

	else:
		return Response(status=404)


# Route: /api/transactionHistory, Get all transaction history from database
# Method: GET
# Expected Response: HTTP Status 200
@app.route('/api/admin/transactionHistory', methods = ['GET'])
def transactionHistory(): 
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()

		if (current_user.user_type != "Admin"): #Ensure only admins 
			return Response(status=404)

		else: 
			transactionHistory = []
			for transaction in Sales.query.all():
				transactionHistory.append({
					"transaction_id" : transaction.transaction_id,
					"transaction_date" : transaction.transaction_date,
					"item_amount" : transaction.item_amount,
					"tax_collected" : transaction.tax_collected,
					"revenue" : transaction.revenue,
					"items_item_id" : transaction.items_item_id,
					"bin_info_bin_id" : transaction.bin_info_bin_id,
					"rack_info_rack_id" : transaction.rack_info_rack_id,
					"customers_customer_id" : transaction.customers_customer_id,
					"users_user_id" : transaction.users_user_id,
					})

			return {
				"transactionHistory" : transactionHistory
				}, 200 #Return array with all prior transactions in it

	else:
		return Response(status=404)


# Route: /api/transactionHistoryDates, Get all transaction history from database
# Method: GET
# Expected Response: HTTP Status 200
@app.route('/api/admin/transactionHistoryDates', methods = ['GET'])
def transactionHistoryDates(): 
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()

		if (current_user.user_type != "Admin"): #Ensure only admins 
			return Response(status=404)

		else: 
			transactionHistoryByDate = []
			for transaction in Sales.query.order_by(desc(Sales.transaction_date)).all():
				transactionHistoryByDate.append({
					"transaction_id" : transaction.transaction_id,
					"transaction_date" : transaction.transaction_date,
					"item_amount" : transaction.item_amount,
					"tax_collected" : transaction.tax_collected,
					"revenue" : transaction.revenue,
					"items_item_id" : transaction.items_item_id,
					"bin_info_bin_id" : transaction.bin_info_bin_id,
					"rack_info_rack_id" : transaction.rack_info_rack_id,
					"customers_customer_id" : transaction.customers_customer_id,
					"users_user_id" : transaction.users_user_id,
					})

			return {
				"transactionHistory" : transactionHistoryByDate
				}, 200 #Return array with all prior transactions in it

	else:
		return Response(status=404)


# Route: /api/admin/editItemInfo, Edit the info for an existing item in the database
# Method: POST
# Requested Data:
#	item_id: Integer
#	item_name: String
#	model_number: String
#	item_price: Integer
#	quantity: Integer
# Expected Response: HTTP Status 200
@app.route('/api/admin/editItemInfo', methods = ['POST'])
def editItemInfo(): 
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()

		if (current_user.user_type != "Admin"): #Ensure only admins 
			return Response(status=404)

		else: 
			itemToUpdate = Items.query.filter_by(item_id = request.json["item_id"]).first() 
			itemToUpdate.item_name = request.json['item_name']
			itemToUpdate.model_number = request.json["model_number"]
			itemToUpdate.item_price = request.json["item_price"]
			itemToUpdate.quantity = request.json["quantity"]
			db.session.merge(itemToUpdate)
			db.session.flush()
			db.session.commit()

			updatedItemInfo = {
				"item_name": itemToUpdate.item_name,
				"model_number" : itemToUpdate.model_number,
				"price" : itemToUpdate.price,
				"quantity" : itemToUpdate.quantity
				}

			return {
				"updatedItemInfo" : updatedItemInfo
				}, 200 #Item properly updated!

	else:
		return Response(status=404)


# Route: /api/admin/editMasterCarton, Edit the info for an existing MC in the database
# Method: POST
# Requested Data:
#	carton_id: Integer
#	carton_size: Integer
# Expected Response: HTTP Status 200
@app.route('/api/admin/editMasterCarton', methods = ['POST'])
def editMasterCarton(): 
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()

		if (current_user.user_type != "Admin"): #Ensure only admins can see list of all users
			return Response(status=404)

		else: 
			MCtoUpdate = Master_Cartons.query.filter_by(carton_id = request.json["carton_id"]).first() 
			MCtoUpdate.carton_size = request.json['carton_size']
			db.session.merge(MCtoUpdate)
			db.session.flush()
			db.session.commit()

			return Response(status=200) #Item properly updated!
	else:
		return Response(status=404)


# Route: /api/admin/addBin, Add a new bin in the database
# Method: POST
# Requested Data:
#	bin_height: Integer
#	bin_location: String
#	rack_info_rack_id: Integer
# Expected Response: HTTP Status 200
@app.route('/api/admin/addBin', methods = ['POST'])
def addBin(): 
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()

		if (current_user.user_type != "Admin"): #Ensure only admins can add bin
			return Response(status=404)

		else: 
			bin_height = request.json["bin_height"]
			bin_location = request.json["bin_location"]
			rack_info_rack_id = request.json['rack_info_rack_id']
			newBin = Bin(bin_height = bin_height, bin_location = bin_location, rack_info_rack_id = rack_info_rack_id)

			db.session.add(newBin)
			db.session.commit()

			return Response(status=200)
	else:
		return Response(status=404)


# Route: /api/admin/addRack, Add a new rack in in the database
# Method: POST
# Requested Data:
#	bin_height: Integer
#	rack_location: String
# Expected Response: HTTP Status 200
@app.route('/api/admin/addRack', methods = ['POST'])
def addRack(): 
	if ("username" in session):
		current_user = Users.query.filter_by(user_username = session["username"]).first()

		if (current_user.user_type != "Admin"): #Ensure only admins can add rack
			return Response(status=404)

		else: 
			rack_location = request.json["bin_height"]
			newRack = Rack(rack_location = rack_location)

			db.session.add(newRack)
			db.session.commit()
			
			return Response(status=200)
	else:
		return Response(status=404)


#Application run stuff, in debug mode for now. TURN DEBUG MODE OFF PRIOR TO PRODUCTION, MAKES APP VULNERABLE 
if __name__ == '__main__':
	app.debug=True
	app.run()
