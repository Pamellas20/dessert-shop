import React from 'react';

// Cart component
function Cart({ cart, updateQuantity, removeFromCart, confirmOrder, showModal, startNewOrder }) {
  const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full md:w-1/3">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
        <h2 className="text-xl font-bold text-rose-900 mb-4">Your Cart ({itemCount})</h2>
        {Object.keys(cart).length === 0 ? (
          <div className="text-center text-rose-500">
            <img src="/assets/images/illustration-empty-cart.svg" alt="Empty Cart" className="mx-auto mb-4 w-48" />
            <p>Your added items will appear here</p>
          </div>
        ) : (
          <>
            {Object.values(cart).map(item => (
              <div key={item.name} className="flex justify-between items-center mb-4 border-b pb-2">
                <div>
                  <h3 className="text-rose-900 font-semibold">{item.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-red font-semibold">{item.quantity}x</span>
                    <span className="text-rose-400">@ ${item.price.toFixed(2)}</span>
                    <span className="text-rose-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.name)}
                  className="text-rose-400 hover:text-chocolate-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <span className="text-rose-900 font-semibold">Order Total</span>
              <span className="text-2xl font-bold text-rose-900">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={confirmOrder}
              className="w-full mt-4 bg-red text-white rounded-full py-2 hover:bg-chocolate-700"
            >
              Confirm Order
            </button>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold text-rose-900">Order Confirmed</h2>
            </div>
            <p className="text-rose-500 mb-4">We hope you enjoy your food!</p>
            {Object.values(cart).map(item => (
              <div key={item.name} className="flex justify-between items-center mb-4 border-b pb-2 bg-rose-50 p-2 rounded">
                <div className="flex items-center">
                  <img src={item.image.thumbnail} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                  <div>
                    <h3 className="text-rose-900 font-semibold">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-red font-semibold">{item.quantity}x</span>
                      <span className="text-rose-400">@ ${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <span className="text-rose-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <span className="text-rose-900 font-semibold">Order Total</span>
              <span className="text-2xl font-bold text-rose-900">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={startNewOrder}
              className="w-full mt-4 bg-red text-white rounded-full py-2 hover:bg-chocolate-700"
            >
              Start New Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;