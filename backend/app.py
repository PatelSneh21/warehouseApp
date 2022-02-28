#This file will import the app and start the development server. 
from flask import Flask, Response
from app import app, db

#Application run stuff, in debug mode for now. TURN DEBUG MODE OFF PRIOR TO PRODUCTION, MAKES APP VULNERABLE 
if __name__ == '__main__':
	app.debug=True
	app.run()



