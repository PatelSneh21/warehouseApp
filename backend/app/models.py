from re import S
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from numpy import quantile
from sqlalchemy.ext.automap import automap_base

app = Flask(__name__)

app.config['SQL_DATABASE_URI'] = ""

db = SQLAlchemy(app)

##schema models
#rack_info = db.Table('rack_info', db.metadata, autoload=True, autoload_with = db.engine)

Base = automap_base()
Base.prepare(db.engine, reflect=True)

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