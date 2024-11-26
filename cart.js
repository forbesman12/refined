document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    document.getElementById('checkoutButton').addEventListener('click', checkout);
});

function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalContainer = document.getElementById('cartTotal');

    // Clear previous items
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalContainer.innerHTML = '';
        return;
    }

    let total = 0;

    cartItems.forEach((item, index) => {
        // Ensure price is a number
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity, 10) || 1; // Default to 1 if invalid
        const itemTotal = price * quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name || "Item"}" onerror="this.onerror=null; this.src='fallback-image.png';">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name || "Unnamed Item"}</div>
                    <div class="cart-item-qty">
                        <label>Qty:</label>
                        <input type="number" value="${quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                    </div>
                    <div class="cart-item-total">Total: $${itemTotal.toFixed(2)}</div>
                    <button onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalContainer.innerHTML = `<h2>Total: $${total.toFixed(2)}</h2>`;
}

function updateQuantity(index, newQuantity) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (newQuantity < 1) return; // Prevent setting quantity to less than 1
    cartItems[index].quantity = parseInt(newQuantity, 10);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems(); // Refresh the cart display
}

function removeItem(index) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.splice(index, 1); // Remove item from the array
 localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems(); // Refresh the cart display
}

function checkout() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let message = "I'd like to order the following items from your store:\n\n";
    
    if (cartItems.length > 0) {
        cartItems.forEach((item) => {
            message += `${item.name || "Unnamed Item"} - ₦${item.price.toLocaleString()} x ${item.quantity}\n`;
        });
    } else {
        message += "(No items in the cart)"; // Fallback message if cart is empty
    }
    
    console.log("Generated WhatsApp Message: ", message); // Debugging message

    const whatsappNumber = "905391373752"; // Your WhatsApp number
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open the WhatsApp link in a new tab
    window.open(whatsappLink, '_blank');
}