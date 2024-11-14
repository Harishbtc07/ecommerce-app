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

# Get product by ID
@app.route('/products/<int:id>', methods=['GET'])
def get_product_by_id(id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, name, image_url, price, description FROM products WHERE id = %s", (id,))
    product = cursor.fetchone()
    cursor.close()
    
    if product:
        product_details = {
            'id': product[0],
            'name': product[1],
            'image_url': product[2],
            'price': product[3],
            'description': product[4]
        }
        return jsonify({'success': True, 'product': product_details})
    
    return jsonify({'success': False, 'message': 'Product not found'}), 404

# Add to Wishlist
@app.route('/wishlist/add', methods=['POST'])
def add_to_wishlist():
    data = request.json
    user_id = data['user_id']
    product_id = data['product_id']

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO wishlist (user_id, product_id) VALUES (%s, %s)", (user_id, product_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'success': True, 'message': 'Product added to wishlist'})

# Remove from Wishlist
@app.route('/wishlist/remove', methods=['POST'])
def remove_from_wishlist():
    data = request.json
    user_id = data['user_id']
    product_id = data['product_id']

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM wishlist WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'success': True, 'message': 'Product removed from wishlist'})

# Get Wishlist Items
@app.route('/wishlist/<int:user_id>', methods=['GET'])
def get_wishlist(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT p.id, p.name, p.image_url, p.price FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = %s", (user_id,))
    wishlist_items = cursor.fetchall()
    cursor.close()

    product_list = [
        {'id': item[0], 'name': item[1], 'image_url': item[2], 'price': item[3]}
        for item in wishlist_items
    ]
    
    return jsonify({'success': True, 'wishlist': product_list})

# Add to Cart
@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    data = request.json
    user_id = data['user_id']
    product_id = data['product_id']
    quantity = data.get('quantity', 1)

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    item = cursor.fetchone()
    
    if item:
        cursor.execute("UPDATE cart SET quantity = quantity + %s WHERE user_id = %s AND product_id = %s", (quantity, user_id, product_id))
    else:
        cursor.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)", (user_id, product_id, quantity))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'success': True, 'message': 'Product added to cart'})

# Remove from Cart
@app.route('/cart/remove', methods=['POST'])
def remove_from_cart():
    data = request.json
    user_id = data['user_id']
    product_id = data['product_id']

    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'success': True, 'message': 'Product removed from cart'})

# Get Cart Items
@app.route('/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT p.id, p.name, p.image_url, p.price, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = %s", (user_id,))
    cart_items = cursor.fetchall()
    cursor.close()

    cart_list = [
        {'id': item[0], 'name': item[1], 'image_url': item[2], 'price': item[3], 'quantity': item[4]}
        for item in cart_items
    ]
    
    return jsonify({'success': True, 'cart': cart_list})


#buynow
@app.route('/buy_now', methods=['POST'])
def buy_now():
    data = request.json
    product_id = data['product_id']
    quantity = data.get('quantity', 1)

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO orders (product_id, quantity, status) VALUES (%s, %s, %s)",
                   (product_id, quantity, 'Confirmed'))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'success': True, 'message': 'Order placed successfully'})



@app.route('/cancel_order', methods=['POST'])
def cancel_order():
    data = request.json
    product_id = data['product_id']  # Use product_id instead of order_id

    # Assuming that the 'orders' table stores 'product_id' and 'id' fields
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM orders WHERE product_id = %s", (product_id,))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'success': True, 'message': 'Order canceled successfully'})



# Get all orders for a specific user
@app.route('/orders', methods=['GET'])
def get_orders():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT o.id, p.name, p.image_url, p.price, o.quantity FROM orders o JOIN products p ON o.product_id = p.id")
    orders = cursor.fetchall()
    cursor.close()

    order_list = [
        {'id': order[0], 'product_name': order[1], 'image_url': order[2], 'price': order[3], 'quantity': order[4]}
        for order in orders
    ]

    return jsonify({'success': True, 'orders': order_list})







if __name__ == '__main__':
    app.run(debug=True)