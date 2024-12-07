// Check if user is logged in
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'login.html';
}

// Get DOM elements
const productsTable = document.getElementById('productsTable');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const addProductBtn = document.getElementById('addProductBtn');
const closeBtn = document.querySelector('.close');

// Product data storage
let products = {
    naturalPlants: [],
    christmasTrees: []
};

// Load products from localStorage or initialize with default data
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Initialize with sample products
        products = {
            naturalPlants: [
                {
                    id: 1,
                    name: 'Poinsettia',
                    image: '../assets/plants/poinsettia.svg',
                    category: 'Natural Plants',
                    price: 499.99,
                    stock: 10,
                    sizes: ['Small', 'Medium'],
                    colors: ['Red', 'White']
                }
            ],
            christmasTrees: [
                {
                    id: 2,
                    name: 'Cedar Tree',
                    image: '../assets/trees/cedar.svg',
                    category: 'Christmas Trees',
                    price: 1499.99,
                    stock: 5,
                    sizes: ['Medium', 'Large'],
                    colors: ['Green']
                }
            ]
        };
        saveProducts();
    }
    displayProducts();
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    // Update the main form if it exists
    if (window.opener) {
        window.opener.postMessage({ type: 'productsUpdated', products }, '*');
    }
}

// Display products in table
function displayProducts() {
    productsTable.innerHTML = '';
    
    // Display Natural Plants
    products.naturalPlants.forEach(product => {
        addProductRow(product);
    });
    
    // Display Christmas Trees
    products.christmasTrees.forEach(product => {
        addProductRow(product);
    });
}

// Add product row to table
function addProductRow(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>EGP ${product.price.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td>${product.sizes.join(', ')}</td>
        <td>${product.colors.join(', ')}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
    `;
    productsTable.appendChild(row);
}

// Open modal for adding new product
function openAddModal() {
    modalTitle.textContent = 'Add New Product';
    productForm.reset();
    productModal.style.display = 'block';
}

// Open modal for editing product
function editProduct(productId) {
    modalTitle.textContent = 'Edit Product';
    const product = findProduct(productId);
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productImage').value = product.image;
        
        // Set size checkboxes
        document.querySelectorAll('input[name="size"]').forEach(checkbox => {
            checkbox.checked = product.sizes.includes(checkbox.value);
        });
        
        // Set color checkboxes
        document.querySelectorAll('input[name="color"]').forEach(checkbox => {
            checkbox.checked = product.colors.includes(checkbox.value);
        });
        
        productModal.style.display = 'block';
    }
}

// Find product by ID
function findProduct(productId) {
    const id = parseInt(productId);
    return [...products.naturalPlants, ...products.christmasTrees]
        .find(product => product.id === id);
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const id = parseInt(productId);
        products.naturalPlants = products.naturalPlants.filter(p => p.id !== id);
        products.christmasTrees = products.christmasTrees.filter(p => p.id !== id);
        saveProducts();
        displayProducts();
    }
}

// Close modal
function closeModal() {
    productModal.style.display = 'none';
}

// Get selected checkbox values
function getSelectedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(checkbox => checkbox.value);
}

// Handle form submission
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value.trim();
    const sizes = getSelectedValues('size');
    const colors = getSelectedValues('color');
    
    // Basic validation
    if (!name || !price || !stock || !image || sizes.length === 0 || colors.length === 0) {
        alert('Please fill in all required fields and select at least one size and color.');
        return;
    }
    
    const productData = {
        id: parseInt(document.getElementById('productId').value) || Date.now(),
        name: name,
        category: document.getElementById('productCategory').value,
        price: price,
        stock: stock,
        image: image,
        sizes: sizes,
        colors: colors
    };
    
    // Remove existing product if editing
    const existingId = document.getElementById('productId').value;
    if (existingId) {
        const id = parseInt(existingId);
        products.naturalPlants = products.naturalPlants.filter(p => p.id !== id);
        products.christmasTrees = products.christmasTrees.filter(p => p.id !== id);
    }
    
    // Add product to appropriate category
    if (productData.category === 'Natural Plants') {
        products.naturalPlants.push(productData);
    } else {
        products.christmasTrees.push(productData);
    }
    
    // Save and update display
    saveProducts();
    displayProducts();
    closeModal();
    
    // Show success message
    alert('Product saved successfully!');
});

// Event Listeners
addProductBtn.addEventListener('click', openAddModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', function(e) {
    if (e.target === productModal) {
        closeModal();
    }
});

// Initialize products
loadProducts(); 