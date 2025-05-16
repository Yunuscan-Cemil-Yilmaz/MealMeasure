from flask import Flask;
from controllers.Controller import api_routes; 

app = Flask(__name__);

api_routes(app);

if __name__ == "__main__":
    app.run(debug=True, port=5000);