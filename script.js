import { products } from './src/data/products.js';

let selectedProduct = null;
let selectedSize = 'small';
let selectedColor = 'red';
let cartItems = [];

function openCartModal() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    updateCartDisplay();
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openProductModal(product) {
    selectedProduct = product;
    const modal = document.getElementById('productModal');
    const productImage = document.getElementById('productImage');
    const productName = document.getElementById('productName');

    productImage.src = product.image;
    productImage.alt = product.name;
    productName.textContent = product.name.toUpperCase();

    selectedSize = 'small';
    selectedColor = 'red';
    document.querySelector('input[name="size"][value="small"]').checked = true;
    document.querySelector('input[name="color"][value="red"]').checked = true;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const cartSummary = document.querySelector('.cart-summary');
    const totalAmount = document.querySelector('.total-amount');
    
    if (cartItems.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCart.style.display = 'flex';
        if (cartSummary) cartSummary.style.display = 'none';
    } else {
        cartItemsContainer.style.display = 'flex';
        emptyCart.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'flex';
        
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.product.name.toUpperCase()}</h3>
                    <p>POT COLOR: ${item.color.toUpperCase()}</p>
                    <p>POT SIZE: ${item.size.toUpperCase()}</p>
                    <p>${item.product.price} EGP</p>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
        `).join('');

        const total = cartItems.reduce((sum, item) => 
            sum + (item.product.price * item.quantity), 0
        );
        if (totalAmount) totalAmount.textContent = `${total.toFixed(2)} EGP`;
        
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });
    }
}

function handleQuantityChange(e) {
    const itemId = e.target.dataset.id;
    const item = cartItems.find(item => item.id === itemId);
    
    if (item) {
        if (e.target.classList.contains('plus')) {
            item.quantity++;
        } else if (e.target.classList.contains('minus')) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cartItems = cartItems.filter(i => i.id !== itemId);
            }
        }
        updateCartDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const naturalPlantsContainer = document.getElementById('natural-plants');
    const christmasTreesContainer = document.getElementById('christmas-trees');

    if (naturalPlantsContainer && products.naturalPlants) {
        naturalPlantsContainer.innerHTML = products.naturalPlants.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name.toUpperCase()}</h3>
                </div>
            </div>
        `).join('');
    }

    if (christmasTreesContainer && products.christmasTrees) {
        christmasTreesContainer.innerHTML = products.christmasTrees.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name.toUpperCase()}</h3>
                </div>
            </div>
        `).join('');
    }

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = parseInt(card.dataset.id);
            const allProducts = [...products.naturalPlants, ...products.christmasTrees];
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                openProductModal(product);
            }
        });
    });

    const cartButton = document.querySelector('.cart-link');
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }

    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const cartItem = {
                id: Date.now().toString(),
                product: selectedProduct,
                size: selectedSize,
                color: selectedColor,
                quantity: 1
            };
            
            const existingItem = cartItems.find(item => 
                item.product.id === cartItem.product.id && 
                item.size === cartItem.size && 
                item.color === cartItem.color
            );
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push(cartItem);
            }
            
            closeProductModal();
            openCartModal();
        });
    }

    document.querySelectorAll('input[name="size"]').forEach(input => {
        input.addEventListener('change', (e) => {
            selectedSize = e.target.value;
        });
    });

    document.querySelectorAll('input[name="color"]').forEach(input => {
        input.addEventListener('change', (e) => {
            selectedColor = e.target.value;
        });
    });

    document.querySelectorAll('.checkout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const checkoutModal = document.getElementById('checkoutModal');
            const cartModal = document.getElementById('cartModal');
            if (checkoutModal && cartModal) {
                checkoutModal.style.display = 'flex';
                cartModal.style.display = 'none';
            }
        });
    });
});