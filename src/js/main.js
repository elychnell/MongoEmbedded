// INITIALIZE
function formateDate (date) {
    return new Date(date).toLocaleDateString()
}

const API_URL = "http://localhost:3000/api/products"

// CREATE PRODUCT
const createForm = document.getElementById('create-product-form')

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('product-name')
    const name = nameInput.value.trim()
    
    if (!name) return

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name: name})
        })

        window.location.href = "index.html"
    } catch (error) {
        productElement.innerHTML = "Opps something when wrong. Please try again later!"
        console.log(error)
    }
})

// READ PRODUCTS
const productElement = document.getElementById('products');
const fetchProducts = async () => {
  try {
    const response =  await fetch(API_URL)
 
    const products =  await response.json()

    renderProducts(products)
  } catch (error) {
    productElement.innerHTML = "Opps something when wrong. Please try again later!"
    console.log(error)
  }
}

fetchProducts();

function renderProducts(products) {
  productElement.innerHTML = products.map((product) => `
    <div class="d-flex justify-content-between align-items-center">
      <p class="mb-0">
        <span class="date"><i>${formateDate(product.created_at)}</i></span>
        <a href="product.html?id=${product._id}">${product.name}</a>
      </p>
      <button type="button" class="btn btn-outline-danger" onclick="deleteProduct('${product._id}')">DELETE</button>
    </div>`
  ).join('')
}

const deleteProduct = async (id) => {

  try {
    await fetch(API_URL + `/${id}`, {
      method: 'DELETE'
    })
    fetchProducts()
  } catch (error) {
    productElement.innerHTML = "Opps something when wrong. Please try again later!"
    console.log(error)
  }
}

//
// console.log(window.location.search)
const productTitle = document.getElementById('product-title')
const categoryList = document.getElementById('category-list')

const params = new URLSearchParams(window.location.search)
const productId = params.get('id');


const fetchProduct = async () => {
    try {
        const response = await fetch(API_URL + `/${productId}`)
        const product = await response.json();
        productTitle.innerText = product.name
        renderCategories(product.categories)
    } catch(e) {
        productElement.innerHTML = "Opps something when wrong. Please try again later!"
        console.log(error)
    }
}

function renderCategories(categories) {
    categoryList.innerHTML = categories.map(category => {
        return `
            <span class="badge bg-primary">${category}</span>
        `
    }).join('')
}

fetchProduct();
            <p>
            <span class="date"><i>${formateDate(subtask.created_at)}</i></span>
            <span>${category.name}</span>
            </p>
        </div>
    `
    }).join('')
} 

fetchProduct();