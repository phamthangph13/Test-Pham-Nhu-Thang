// API Base URL - Update this to match your API endpoint
const API_URL = '/api/products';

// DOM Elements
const productForm = document.getElementById('productForm');
const productIdInput = document.getElementById('productId');
const productNameInput = document.getElementById('productName');
const quantityInput = document.getElementById('quantity');
const notesInput = document.getElementById('notes');
const saveBtn = document.getElementById('saveBtn');
const updateBtn = document.getElementById('updateBtn');
const resetBtn = document.getElementById('resetBtn');
const productsTableBody = document.getElementById('productsTableBody');
const searchInput = document.getElementById('searchInput');
const notification = document.getElementById('notification');
const notificationIcon = document.getElementById('notificationIcon');
const notificationMessage = document.getElementById('notificationMessage');
const confirmDialog = document.getElementById('confirmDialog');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const loader = document.getElementById('loader');
const noProducts = document.getElementById('noProducts');
const themeToggle = document.querySelector('.theme-toggle');

// State
let products = [];
let currentProductId = null;
let deleteProductId = null;
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Apply theme
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Load products
    fetchProducts();

    // Event listeners
    productForm.addEventListener('submit', handleFormSubmit);
    updateBtn.addEventListener('click', handleUpdate);
    resetBtn.addEventListener('click', resetForm);
    searchInput.addEventListener('input', handleSearch);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', cancelDelete);
    themeToggle.addEventListener('click', toggleTheme);
});

// Fetch all products
async function fetchProducts() {
    showLoader();
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        products = await response.json();
        renderProducts();
        showNotification('Products loaded successfully', 'success', 'fa-check-circle');
    } catch (error) {
        console.error('Error fetching products:', error);
        showNotification('Failed to load products', 'error', 'fa-exclamation-circle');
    } finally {
        hideLoader();
    }
}

// Render products table
function renderProducts(filteredProducts = null) {
    const displayProducts = filteredProducts || products;
    productsTableBody.innerHTML = '';
    
    if (displayProducts.length === 0) {
        noProducts.classList.remove('hidden');
        return;
    }
    
    noProducts.classList.add('hidden');
    
    displayProducts.forEach(product => {
        const row = document.createElement('tr');
        row.dataset.id = product.productId;
        
        row.innerHTML = `
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td>${product.quantity}</td>
            <td>${product.notes || '-'}</td>
            <td>
                <div class="action-buttons">
                    <div class="action-btn edit-btn" onclick="editProduct('${product.productId}')">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="action-btn delete-btn" onclick="deleteProduct('${product.productId}')">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            </td>
        `;
        
        productsTableBody.appendChild(row);
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const product = {
        productId: productIdInput.value,
        productName: productNameInput.value,
        quantity: parseInt(quantityInput.value),
        notes: notesInput.value
    };
    
    showLoader();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        
        if (!response.ok) throw new Error('Failed to create product');
        
        const newProduct = await response.json();
        products.push(newProduct);
        renderProducts();
        resetForm();
        showNotification('Product created successfully', 'success', 'fa-check-circle');
        
        // Highlight the new row
        highlightRow(newProduct.productId, 'new-row');
    } catch (error) {
        console.error('Error creating product:', error);
        showNotification('Failed to create product', 'error', 'fa-exclamation-circle');
    } finally {
        hideLoader();
    }
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.productId === id);
    if (!product) return;
    
    currentProductId = id;
    productIdInput.value = product.productId;
    productIdInput.disabled = true;
    productNameInput.value = product.productName;
    quantityInput.value = product.quantity;
    notesInput.value = product.notes || '';
    
    saveBtn.disabled = true;
    updateBtn.disabled = false;
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Handle update
async function handleUpdate() {
    if (!currentProductId) return;
    
    const product = {
        productId: productIdInput.value,
        productName: productNameInput.value,
        quantity: parseInt(quantityInput.value),
        notes: notesInput.value
    };
    
    showLoader();
    
    try {
        const response = await fetch(`${API_URL}/${currentProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        
        if (!response.ok) throw new Error('Failed to update product');
        
        // Update local data
        const index = products.findIndex(p => p.productId === currentProductId);
        if (index !== -1) {
            products[index] = product;
        }
        
        renderProducts();
        resetForm();
        showNotification('Product updated successfully', 'success', 'fa-check-circle');
        
        // Highlight the updated row
        highlightRow(currentProductId, 'updated-row');
    } catch (error) {
        console.error('Error updating product:', error);
        showNotification('Failed to update product', 'error', 'fa-exclamation-circle');
    } finally {
        hideLoader();
    }
}

// Delete product
function deleteProduct(id) {
    deleteProductId = id;
    confirmDialog.classList.add('show');
}

// Confirm delete
async function confirmDelete() {
    if (!deleteProductId) return;
    
    showLoader();
    
    try {
        const response = await fetch(`${API_URL}/${deleteProductId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete product');
        
        // Add delete animation
        const row = document.querySelector(`tr[data-id="${deleteProductId}"]`);
        if (row) {
            row.classList.add('delete-row');
            setTimeout(() => {
                // Remove from local data
                products = products.filter(p => p.productId !== deleteProductId);
                renderProducts();
            }, 300);
        }
        
        showNotification('Product deleted successfully', 'success', 'fa-check-circle');
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Failed to delete product', 'error', 'fa-exclamation-circle');
    } finally {
        hideLoader();
        cancelDelete();
    }
}

// Cancel delete
function cancelDelete() {
    deleteProductId = null;
    confirmDialog.classList.remove('show');
}

// Reset form
function resetForm() {
    productForm.reset();
    productIdInput.disabled = false;
    currentProductId = null;
    saveBtn.disabled = false;
    updateBtn.disabled = true;
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        renderProducts();
        return;
    }
    
    const filtered = products.filter(product => 
        product.productId.toLowerCase().includes(searchTerm) ||
        product.productName.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filtered);
}

// Show notification
function showNotification(message, type, icon) {
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    
    notificationIcon.className = 'fas';
    notificationIcon.classList.add(icon);
    
    notificationMessage.textContent = message;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Highlight row
function highlightRow(id, className) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        row.classList.add(className);
        setTimeout(() => {
            row.classList.remove(className);
        }, 2000);
    }
}

// Toggle theme
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('darkTheme', isDarkTheme);
    
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Show loader
function showLoader() {
    loader.style.display = 'flex';
}

// Hide loader
function hideLoader() {
    loader.style.display = 'none';
}