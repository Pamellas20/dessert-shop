import { useState, useEffect } from "react"
import { ShoppingCart, Minus, Plus, X, CheckCircle, Leaf } from "lucide-react"

// Main component that contains all other components
const ProductCard = () => {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch products from data.json
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/data.json")
        const data = await response.json()

        // Add unique IDs to each product
        const productsWithIds = data.map((product, index) => ({
          ...product,
          id: (index + 1).toString(),
          stocked: true,
        }))

        setProducts(productsWithIds)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Custom hook for responsive image selection
  const useResponsiveImage = () => {
    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

    useEffect(() => {
      if (typeof window === "undefined") return

      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    const getImageType = () => {
      if (windowWidth < 640) return "mobile"
      if (windowWidth < 1024) return "tablet"
      return "desktop"
    }

    return getImageType
  }

  const getImageType = useResponsiveImage()

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const confirmOrder = () => {
    setShowConfirmation(true)
  }

  const startNewOrder = () => {
    setCartItems([])
    setShowConfirmation(false)
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Individual Product Card Component
  const ProductItem = ({ product, onAddToCart, quantity, onUpdateQuantity }) => {
    const imageType = getImageType()
    const imagePath = product.image ? product.image[imageType] : "/placeholder.svg"

    return (
      <div className="flex flex-col">
        <div className="relative mb-2">
          <img
            src={imagePath || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-[200px] object-cover rounded-lg"
          />
          {quantity > 0 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-[#d14b29] text-white rounded-full px-4 py-1">
              <button
                onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                className="p-1 hover:bg-[#b33e22] rounded-full transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="mx-3 font-medium">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                className="p-1 hover:bg-[#b33e22] rounded-full transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">{product.category}</div>
        <h3 className="font-medium text-[#2b1910]">{product.name}</h3>
        <p className="text-[#d14b29] font-medium">${product.price.toFixed(2)}</p>
        {quantity === 0 && (
          <button
            onClick={() => onAddToCart(product)}
            className="mt-2 flex items-center justify-center gap-2 border border-[#d14b29] text-[#d14b29] py-2 px-4 rounded-full hover:bg-[#d14b29] hover:text-white transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    )
  }

  // Product Grid Component
  const ProductGrid = ({ products, onAddToCart, cartItems, onUpdateQuantity }) => {
    if (loading) {
      return <div className="text-center py-10">Loading products...</div>
    }

    return (
      <div>
        <h1 className="text-4xl font-bold text-[#2b1910] mb-6">Desserts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const cartItem = cartItems.find((item) => item.id === product.id)
            return (
              <ProductItem
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                quantity={cartItem?.quantity || 0}
                onUpdateQuantity={onUpdateQuantity}
              />
            )
          })}
        </div>
      </div>
    )
  }

  // Cart Component
  const Cart = ({ items, onRemoveItem, onUpdateQuantity, total, onConfirmOrder, totalItems }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6 h-fit">
        <h2 className="text-xl font-bold text-[#d14b29] mb-6">Your Cart ({totalItems})</h2>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src="/placeholder.svg?height=100&width=100"
              alt="Empty cart"
              className="mb-4 opacity-50 w-[100px] h-[100px]"
            />
            <p className="text-gray-500">Your added items will appear here</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600">{item.quantity}x</div>
                    <div className="text-gray-400">@</div>
                    <div className="text-gray-600">${item.price.toFixed(2)}</div>
                    <div className="font-medium">{item.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center font-bold mb-6">
              <div>Order Total</div>
              <div className="text-2xl">${total.toFixed(2)}</div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
              <Leaf className="w-4 h-4 text-green-500" />
              <span>
                This is a <span className="font-medium">carbon-neutral</span> delivery
              </span>
            </div>

            <button
              onClick={onConfirmOrder}
              className="w-full bg-[#d14b29] text-white py-3 rounded-lg font-medium hover:bg-[#b33e22] transition-colors"
            >
              Confirm Order
            </button>
          </>
        )}
      </div>
    )
  }

  // Order Confirmation Component
  const OrderConfirmation = ({ cartItems, total, onStartNewOrder }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-3xl font-bold text-[#2b1910] mb-2">Order Confirmed</h2>
          <p className="text-gray-600">We hope you enjoy your food!</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <img
                  src={item.image?.thumbnail || "/placeholder.svg"}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.quantity}x @ ${item.price.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}

          <div className="flex justify-between items-center font-bold pt-3">
            <div>Order Total</div>
            <div className="text-xl">${total.toFixed(2)}</div>
          </div>
        </div>

        <button
          onClick={onStartNewOrder}
          className="w-full bg-[#d14b29] text-white py-3 rounded-lg font-medium hover:bg-[#b33e22] transition-colors"
        >
          Start New Order
        </button>
      </div>
    )
  }

  // Main render
  return (
    <div className="min-h-screen bg-[#f8f5f2] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {showConfirmation ? (
          <OrderConfirmation cartItems={cartItems} total={calculateTotal()} onStartNewOrder={startNewOrder} />
        ) : (
          <div className="grid md:grid-cols-[1fr_350px] gap-6">
            <ProductGrid
              products={products}
              onAddToCart={addToCart}
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
            />
            <Cart
              items={cartItems}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              total={calculateTotal()}
              onConfirmOrder={confirmOrder}
              totalItems={totalItems}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
