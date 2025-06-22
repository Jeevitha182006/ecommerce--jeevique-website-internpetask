const products = [
  {
    id: 1,
    name: "Gold Earrings",
    price: 999,
    category: "accessories",
    image: "images/gold earrings.jpg"
  },
  {
    id: 2,
    name: "Summer Dress",
    price: 799,
    category: "dresses",
    image:"images/summer dresses.jpg"
  },
  {
    id: 3,
    name: "Smartphone",
    price: 9999,
    category: "electronics",
    image: "images/smartphones.jpg"
  },
  {
    id: 4,
    name: "Cushion Set",
    price: 499,
    category: "home",
    image: "images/cushionset.jpg"
  },
  {
    id: 5,
    name: "School Bag",
    price: 599,
    category: "school",
    image: "images/schoolbag.jpg"
  },
  {
    id: 6,
    name: "Wrist Watch",
    price: 1299,
    category: "accessories",
    image: "images/watcheswrist.jpg"
  },
  {
    id: 7,
    name: "Designer Saree",
    price: 1199,
    category: "dresses",
    image: "images/dessignersaree.jpg"
  },
  {
    id: 8,
    name: "Blender Mixer",
    price: 1499,
    category: "home",
    image:"images/blender.jpg"
  },
  {
    id: 9,
    name: "Notebook Pack",
    price: 199,
    category: "school",
    image: "images/notebook.jpg"
  },{
    id: 10,
    name: "Headset",
    price: 199,
    category: "electronics",
    image: "images/headsets.webp"
  },

{
    id: 11,
    name: "rings and chains",
    price: 599,
    category: "accessories",
    image: "images/chains.png"
  },
  {
    id: 12,
    name: "Material clothes",
    price: 799,
    category: "dresses",
    image:"images/material.jpg"
  },
  {
    id: 13,
    name: "pattu saree",
    price: 1999,
    category: "dresses",
    image: "images/pattu.jpg"
  },
  {
    id: 14,
    name: "pens-pencils",
    price: 499,
    category: "school",
    image: "images/pensss.jpg"
  },
  {
    id: 15,
    name: "mat",
    price: 599,
    category: "home",
    image: "images/mat.jpg"
  },

];

const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const totalPriceEl = document.getElementById("total-price");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let cart = [];

function renderProducts(filteredProducts = products) {
  productList.innerHTML = "";
  filteredProducts.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₹${item.price} x ${item.quantity}
      <span class="remove-btn" onclick="removeFromCart(${index})">✖</span>
    `;
    cartList.appendChild(li);
  });
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  totalPriceEl.textContent = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
  renderProducts(filtered);
});

categoryFilter.addEventListener("change", () => {
  const cat = categoryFilter.value;
  const filtered = cat === "all" ? products : products.filter(p => p.category === cat);
  renderProducts(filtered);
});

// Initial Load
renderProducts();
let currentModalProduct = null;

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  currentModalProduct = product;

  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("mainImage").src = product.image;
  document.getElementById("modalDescription").textContent = product.description;
  document.getElementById("modalPrice").textContent = product.price;

  const subImagesDiv = document.getElementById("subImages");
  subImagesDiv.innerHTML = "";
  product.images.forEach(img => {
    const image = document.createElement("img");
    image.src = img;
    image.onclick = () => document.getElementById("mainImage").src = img;
    subImagesDiv.appendChild(image);
  });

  document.getElementById("productModal").style.display = "block";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

function addModalProductToCart() {
  if (currentModalProduct) {
    addToCart(currentModalProduct.id);
    closeModal();
  }
}

// Show order form on button click
document.getElementById("placeOrderBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById("orderForm").style.display = "block";
});

// Submit order
function submitOrder() {
  const name = document.getElementById("customerName").value;
  const address = document.getElementById("customerAddress").value;

  if (!name || !address) {
    alert("Please fill in all details.");
    return;
  }

  const order = {
    name,
    address,
    items: [...cart],
    total: cart.reduce((acc, item) => acc + item.price, 0),
    date: new Date().toLocaleString()
  };

  // Save to localStorage
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Show thank-you message
  document.getElementById("orderMessage").innerText =
    `🎉 Thank you, ${name}! Your order has been placed successfully.`;

  // Clear cart and form
  cart = [];
  renderCart();
  document.getElementById("orderForm").style.display = "none";
  document.getElementById("customerName").value = "";
  document.getElementById("customerAddress").value = "";
}

function showMyOrders() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  if (orders.length === 0) {
    document.getElementById("ordersList").innerHTML = "<p>No orders found.</p>";
    return;
  }

  let html = "<h3>My Orders</h3>";
  orders.forEach((order, i) => {
    html += `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
        <p><strong>Order #${i + 1}</strong> - ${order.date}</p>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${order.items.map(item => `<li>${item.name} - ₹${item.price}</li>`).join("")}
        </ul>
        <p><strong>Total:</strong> ₹${order.total}</p>
      </div>
    `;
  });

  document.getElementById("ordersList").innerHTML = html;
}
