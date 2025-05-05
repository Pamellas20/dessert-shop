// Import React hooks for state and side effects
import React, { useState, useEffect } from 'react';
// Import the Cart and Product components
import Cart from './Components/Cart';
import Product from './Components/Product';

// Main App component
function App() {
  const [cart, setCart] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);

  // Fetch data from public/data.json when the component mounts
  useEffect(() => {
    fetch('/data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const addToCart = (item) => {
    setCart(prevCart => ({
      ...prevCart,
      [item.name]: { ...item, quantity: (prevCart[item.name]?.quantity || 0) + 1 }
    }));
  };

  const updateQuantity = (itemName, change) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      const item = newCart[itemName];
      if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          delete newCart[itemName];
        } else {
          item.quantity = newQuantity;
        }
      }
      return newCart;
    });
  };

  const removeFromCart = (itemName) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[itemName];
      return newCart;
    });
  };

  const confirmOrder = () => {
    setShowModal(true);
  };

  const startNewOrder = () => {
    setCart({});
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-rose-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-rose-900 mb-6">Desserts</h1>
          {data.length === 0 ? (
            <p className="text-rose-500">Loading desserts...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.map(item => (
                <Product
                  key={item.name}
                  item={item}
                  addToCart={addToCart}
                  updateQuantity={updateQuantity}
                  cart={cart}
                />
              ))}
            </div>
          )}
        </div>
        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          confirmOrder={confirmOrder}
          showModal={showModal}
          startNewOrder={startNewOrder}
        />
      </div>
    </div>
  );
}

export default App;