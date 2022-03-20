#This file will import the app and start the development server. 
from flask import Flask, Response
from app import app, db

#The below is an example of how to get environment variables. 
#API keys, password hash salts, etc will be stored as an environment variable and not uploaded to github.
#print(os.environ['PASSWORD_SALT'])


