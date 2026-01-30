const express = require("express")
const router = express.Router()
const Cart = require("../models/Cart")
const Product = require("../models/Product")

// Auth middleware
const isAuthenticated = (req, res, next) => {
  const userId = req.query.userId
  if (!userId) {
    return res.status(401).json({ message: "Login first" })
  }
  req.userId = userId
  next()
}

/* ----------------------------------
   ADD TO CART
-----------------------------------*/
router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.userId

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    let cart = await Cart.findOne({ userId })

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }]
      })
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      )

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity
      } else {
        cart.items.push({ productId, quantity })
      }
    }

    await cart.save()
    res.status(200).json({ message: "Added to cart" })
  } catch (err) {
    res.status(500).json({ message: "Add to cart failed", error: err })
  }
})

/* ----------------------------------
   GET CART
-----------------------------------*/
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId })
      .populate("items.productId")

    if (!cart) {
      return res.status(200).json({ items: [] })
    }

    res.status(200).json(cart)
  } catch (err) {
    res.status(500).json({ message: "Fetch cart failed" })
  }
})

/* ----------------------------------
   UPDATE QUANTITY
-----------------------------------*/
router.put("/update", isAuthenticated, async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.userId

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be >= 1" })
    }

    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    )

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    item.quantity = quantity
    await cart.save()

    res.status(200).json({ message: "Cart updated" })
  } catch (err) {
    res.status(500).json({ message: "Update failed" })
  }
})

/* ----------------------------------
   REMOVE ITEM
-----------------------------------*/
router.delete("/remove", isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.query
    const userId = req.userId

    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    )

    await cart.save()
    res.status(200).json({ message: "Item removed" })
  } catch (err) {
    res.status(500).json({ message: "Remove failed" })
  }
})

module.exports = router
