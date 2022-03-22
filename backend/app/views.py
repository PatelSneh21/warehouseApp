#This is where routes are defined for our application
# App modules
from flask import Blueprint, redirect, url_for, render_template, request, make_response, session, Response, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

#from app.models import User

views = Blueprint("views", __name__)


@views.route("/getStatus")
def getStatus(): 
	return "Working"



