from re import S
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from numpy import quantile
from sqlalchemy.ext.automap import automap_base

#rack_info = db.Table('rack_info', db.metadata, autoload=True, autoload_with = db.engine)

Base = automap_base()
Base.prepare(db.engine, reflect=True)

#Database Setup:

class Rack_Info(db.Model):
	rack_id = db.Column(db.Integer, primary_key = True)
	rack_location = db.Column(db.String(120), unique = True, nullable = False)


class Bin_Info(db.Model):
	bin_id = db.Column(db.Integer, primary_key = True)
	bin_location = db.Column(db.String(120), unique = True, nullable = False)
	bin_height = db.Column(db.Integer)
	rack_info_rack_id = db.Column(db.Integer, db.ForeignKey(rack_info.rack_id))

#pulls models by scanning db
Rack_Info = Base.classes.rack_info
Bin_Info = Base.classes.bin_info
Deposits = Base.classes.deposits
Items = Base.classes.items
Customers = Base.classes.customers
Users = Base.classes.users
Sales = Base.classes.sales
Samples = Base.classes.samples
Master_Cartons = Base.classes.master_cartons


@app.route('/')
def index():
    new_item = Items(item_id="od", item_name="pipe", model_number="123abc", item_price=49.99, quantity="5")
    db.session.add(new_item)
    db.session.commit()
    #results = db.session.query(Product).all()
    #for r in results:
    #    print(r.name)
    
    return ""