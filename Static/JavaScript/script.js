document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 1. GLOBAL DATA
let cart = JSON.parse(localStorage.getItem('craftora_cart')) || [];
let currentQuantity = 1;

// 2. MODAL LOGIC
function openModal(name, price, img, desc) {
    document.getElementById("productModal").style.display = "flex";
    document.getElementById("modal-name").innerText = name;
    document.getElementById("modal-price").innerText = price;
    document.getElementById("modal-img").src = img;
    document.getElementById("modal-desc").innerText = desc;
    
    currentQuantity = 1; 
    document.getElementById("qty").innerText = currentQuantity;
    document.body.style.overflow = "hidden"; 
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
    document.body.style.overflow = "auto";
}

// 3. QUANTITY LOGIC
function increaseQty() { 
    currentQuantity++; 
    document.getElementById("qty").innerText = currentQuantity; 
}
function decreaseQty() { 
    if (currentQuantity > 1) { 
        currentQuantity--; 
        document.getElementById("qty").innerText = currentQuantity; 
    } 
}

// 4. CART CORE LOGIC
function addToCart() {
    const name = document.getElementById("modal-name").innerText;
    const priceRaw = document.getElementById("modal-price").innerText;
    const img = document.getElementById("modal-img").src;
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.qty += currentQuantity;
    } else {
        cart.push({ name, priceRaw, img, qty: currentQuantity });
    }
    
    localStorage.setItem('craftora_cart', JSON.stringify(cart));
    renderCart();
    closeModal();
    toggleCart(); // Auto-opens the sidebar to show the added item
}

function renderCart() {
    const list = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    const countEl = document.getElementById("cartCount");

    let total = 0;
    let totalItems = 0;

    cart.forEach((item) => {
        totalItems += item.qty;
        
        // FIX: Replaces comma with dot so parseFloat works for €65,00 EUR
        let cleanPrice = item.priceRaw.replace(',', '.');
        const priceNum = parseFloat(cleanPrice.replace(/[^\d.]/g, ''));
        
        total += priceNum * item.qty;
    });

    if (countEl) countEl.innerText = totalItems;
    if (totalEl) totalEl.innerText = `€${total.toFixed(2)} EUR`;

    if (list) {
        list.innerHTML = "";
        if (cart.length === 0) {
            list.innerHTML = '<p class="empty-cart-msg">Your shopping bag is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                list.innerHTML += `
                    <div class="cart-item" style="display:flex; gap:15px; margin-bottom:20px; align-items:center; border-bottom:1px solid #f9f9f9; padding-bottom:10px;">
                        <img src="${item.img}" style="width:60px; height:70px; object-fit:cover; border-radius:4px;">
                        <div style="flex:1;">
                            <h4 style="margin:0; font-size:14px; font-family:'Cormorant Garamond', serif;">${item.name}</h4>
                            <p style="margin:5px 0 0; font-size:12px; color:#9e917a;">${item.qty} x ${item.priceRaw}</p>
                        </div>
                        <button onclick="removeItem(${index})" class="cart-remove-btn">&times;</button>
                    </div>`;
            });
        }
    }
}

function toggleCart() {
    const sidebar = document.querySelector(".cart-sidebar"); 
    const overlay = document.querySelector(".cart-overlay");
    const mainContent = document.querySelector(".craftora-luxury-site"); // Targets your main container
    
    if (sidebar) {
        sidebar.classList.toggle("open");
        const isOpen = sidebar.classList.contains("open");
        
        if (overlay) {
            overlay.style.display = isOpen ? "block" : "none";
        }
        
        // BLUR EFFECT
        if (mainContent) {
            mainContent.style.filter = isOpen ? "blur(5px)" : "none";
            mainContent.style.transition = "filter 0.4s ease";
        }
    }
}

// 5. SIDEBAR TOGGLE (Updated IDs to match CSS)
function toggleCart() {
    const sidebar = document.querySelector(".cart-sidebar"); 
    const overlay = document.querySelector(".cart-overlay");
    
    if (sidebar) {
        sidebar.classList.toggle("open");
        if (overlay) {
            overlay.style.display = sidebar.classList.contains("open") ? "block" : "none";
        }
    }
}

// 6. INITIALIZATION
window.onload = function() {
    renderCart();

    // Attach click event to the Trolley Icon
    const trolley = document.getElementById("cart-icon");
    if (trolley) {
        trolley.addEventListener("click", toggleCart);
    }

    // Attach click event to the Close Button inside cart
    const closeBtn = document.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", toggleCart);
    }
};