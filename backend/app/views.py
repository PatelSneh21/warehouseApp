#This is where routes are defined for our application
# App modules
from flask import Blueprint, redirect, url_for, render_template, request, make_response, session, Response, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

#from app.models import User

views = Blueprint("views", __name__)

def check(email): #Allows us to determine whether or not a given string is a valid email or not 
    if(re.match(regex, email)):
        return True 
    else:
        return False

@views.route("/getStatus")
def getStatus(): 
	return "Working"

#Login a user
@views.route('/api/login', methods = ['POST', 'GET'])
def login():
	if "email" in session:
		return Response(status = 300) #User is already logged in, redirect to dashboard

	if request.method == 'POST':
		email = request.json["email"]
		email = email.lower()
		password = request.json["password"]
		sessionPermanance = request.json['rememberMe']

		user = User.query.filter_by(email = email).first()
		if user is None: #If there was no user found with that email
			return Response(status = 404) #Error

		if check_password_hash(user.password_hashed, password + os.environ['PASSWORD_SALT']): #Check if the password matches, if so log them in and send them to the dashboard
			session.permanent = sessionPermanance	
			session["email"] = customer.email 
			return Response(status = 200) #Redirect to dashboard

		return Response(status = 404) #If the password doesn't match then don't log them in and return an error 

	#Our GET Request so that users can access the login page
	return Response(status = 200)


#Log a user out
@views.route('/api/logout')
def logout():
	if "email" in session is None:
		return Response(status = 300) #Sends the user back to the home page if they are trying to log out without being logged in, redirect to /index

	else: 
			session.pop("email", None) 
			return Response(status = 200)


#Check if a user is logged in, if so, return the user info
@views.route('/api/isLoggedIn', methods = ['GET'])
def isLoggedIn():
	user = {}
	if ("email" in session):
		user = User.query.filter_by(email = session["email"]).first()
		userInfo = {
			"firstName": user.firstName,
			"lastName": user.lastName,
			"email" : user.email
		}
		return user, 202
	else:
		return Response(status=200)