import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (!userId) {
      alert("Login first")
      navigate("/login")
      return
    }
    fetchCart()
  }, [])

  function fetchCart() {
    axios
      .get("http://localhost:4000/api/cart", {
        params: { userId }
      })
      .then((res) => {
        if (res.status === 200) {
          setCartItems(res.data.items)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log("Error fetching cart", err)
      })
  }

  function removeFromCart(productId) {
    axios
      .delete("http://localhost:4000/api/cart/remove", {
        params: { userId, productId }
      })
      .then((res) => {
        alert(res.data.message)
        fetchCart()
      })
      .catch((err) => {
        console.log("Remove error", err)
      })
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return

    axios
      .put(
        "http://localhost:4000/api/cart/update",
        { productId, quantity },
        { params: { userId } }
      )
      .then(() => fetchCart())
      .catch((err) => console.log(err))
  }

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>

      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4 mt-3">
          {cartItems.map((item) => (
            <div className="col" key={item.productId._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5>{item.productId.name}</h5>
                  <p><b>Price:</b> ₹{item.productId.price}</p>
                  <p><b>Quantity:</b> {item.quantity}</p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.productId._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

