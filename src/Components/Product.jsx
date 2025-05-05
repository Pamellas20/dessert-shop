import React from 'react';

// Product component
function Product({ item, addToCart, updateQuantity, cart }) {
  const isInCart = cart[item.name];

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={item.image.desktop} 
        alt={item.name} 
        className={`w-full h-40 object-cover ${isInCart ? 'border-2 border-red' : ''}`}
      />
      <div className="p-3">
        <p className="text-rose-500 text-sm uppercase tracking-wide">{item.category}</p>
        <h2 className="text-lg font-semibold text-rose-900">{item.name}</h2>
        <p className="text-red font-semibold">${item.price.toFixed(2)}</p>
      </div>
      {isInCart ? (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center bg-red text-white rounded-full px-3 py-1">
          <button 
            onClick={() => updateQuantity(item.name, -1)}
            className="w-5 h-5 flex items-center justify-center rounded-full border border-white hover:bg-chocolate-50 hover:text-red"
          >
            -
          </button>
          <span className="mx-2 text-sm">{cart[item.name].quantity}</span>
          <button 
            onClick={() => updateQuantity(item.name, 1)}
            className="w-5 h-5 flex items-center justify-center rounded-full border border-white hover:bg-chocolate-50 hover:text-red"
          >
            +
          </button>
        </div>
      ) : (
        <button 
          onClick={() => addToCart(item)}
          className="absolute bottom-3 right-3 bg-rose-100 text-rose-900 border border-rose-300 rounded-full px-2 py-0.5 text-[10px] font-semibold hover:bg-rose-200 transition-all duration-200"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}

export default Product;
