import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const role=localStorage.getItem("role")
  useEffect(() => {
    fetchProducts()
  }, [])
  function addToCart(id){
    console.log(id,role)
  }
  async function fetchProducts() {
    axios.get("http://localhost:4000/api/product")
      .then((res) => {
        console.log(res.data)
        if (res.status == 200) {
          setProducts(res.data)
          setLoading(false)

        }
      })
  }
  return (
    <div className='container mt-4'>
      <h2>Products</h2>
      {
        loading ? (<p>Loading...</p>) : (
          <div className='row row-cols-1 row-cols-md-3 g-4'>
            {
              products.map((i) => (
                <div className="col" key={i._id}>
                  <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title"><b>Name:</b>{i.name}</h5>
                        <p className="card-text"><b>Price: </b>{i.price}</p>
                        <p className="card-text"><b>Category: </b>{i.category}</p>
                        <p className="card-text"><b>Description: </b>{i.description}</p>
                        <p className="card-text"><b>Stock: </b>{i.stock}</p>
                        <button onClick={()=>addToCart(i._id)} className='btn btn-warning'>Add to Cart</button>
                      </div>
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}