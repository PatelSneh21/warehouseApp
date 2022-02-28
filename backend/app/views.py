#This is where routes are defined for our application
# App modules
from flask import Blueprint
#from app.models import User

views = Blueprint("views", __name__)

@views.route("/getStatus")
def getStatus(): 
	return "Hello"