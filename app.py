from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from config import Config

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

mysql = MySQL(app)

# Register route
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data['name']
    email = data['email']
    password = data['password']
    gender = data['gender']  # New field
    country = data['country']  # New field
    interests = ','.join(data['interests'])  # Convert list to string

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO users (name, email, password, gender, country, interests) VALUES (%s, %s, %s, %s, %s, %s)", 
                   (name, email, password, gender, country, interests))
    mysql.connection.commit()
    cursor.close()
        
    return jsonify({'success': True})

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()
    cursor.close()

    if user:
        return jsonify({'success': True})
    return jsonify({'success': False})

# Get all products
@app.route('/products', methods=['GET'])
def get_products():
    cursor = mysql.connection.cursor()
    
    # Select the required product fields (including image, price, and description)
    cursor.execute("SELECT id, name, image_url, price, description FROM products")
    products = cursor.fetchall()
    cursor.close()
    
    # Format the products into a list of dictionaries for easier consumption on the frontend
    product_list = [
        {
            'id': product[0],
            'name': product[1],
            'image_url': product[2],
            'price': product[3],
            'description': product[4]
        }
        for product in products
    ]
    
    return jsonify({'success': True, 'products': product_list})

# Get product by ID (for Product Details page)
@app.route('/products/<int:id>', methods=['GET'])
def get_product_by_id(id):
    cursor = mysql.connection.cursor()
    
    # Select product by ID
    cursor.execute("SELECT id, name, image_url, price, description FROM products WHERE id = %s", (id,))
    product = cursor.fetchone()
    cursor.close()
    
    # If product exists, return its details
    if product:
        product_details = {
            'id': product[0],
            'name': product[1],
            'image_url': product[2],
            'price': product[3],
            'description': product[4]
        }
        return jsonify({'success': True, 'product': product_details})
    
    # If no product is found
    return jsonify({'success': False, 'message': 'Product not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
