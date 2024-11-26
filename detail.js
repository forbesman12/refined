import { products } from './imagedata.js';

// Get the product ID from the query string
const productID = new URLSearchParams(window.location.search).get('id');

// Fetch the product by ID
const product = products.data.find(item => item.item === productID);

if (product) {
    // Populate product details in the DOM
    document.getElementById('productImage').src = new URL(product.image, window.location.origin).href;
    document.getElementById('productName').textContent = product.productName;
    document.getElementById('productCategory').textContent = `Category: ${product.category}`;
    document.getElementById('productPrice').textContent = `Price: $${product.price}`;
    // Display additional images
    const additionalImagesContainer = document.getElementById('additionalImagesContainer');
    if (product.additionalImages && product.additionalImages.length > 0) {
        product.additionalImages.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = new URL(image, window.location.origin).href;
            imgElement.alt = 'Additional Image';
            imgElement.style.width = '50px'; // Adjust size as needed
            imgElement.style.cursor = 'pointer';
            imgElement.addEventListener('click', () => {
                productImage.src = imgElement.src; // Change the main product image
            });
            additionalImagesContainer.appendChild(imgElement);
        });
    }
} else {
    document.getElementById('productDetailContainer').innerHTML = '<p>Product not found.</p>';
}
// Function to display related products
function displayRelatedProducts(currentProductId) {
    const relatedContainer = document.querySelector('.relate');

    // Filter out the current product
    const relatedProducts = products.data.filter(product => product.item !== currentProductId);

  // Group products by category
  const groupedByCategory = relatedProducts.reduce((groups, product) => {
    if (!groups[product.category]) {
        groups[product.category] = [];
    }
    groups[product.category].push(product);
    return groups;
}, {});

// Pick one random product from each category
const selectedProducts = Object.values(groupedByCategory)
    .map(categoryProducts => categoryProducts[Math.floor(Math.random() * categoryProducts.length)])
    .slice(0, 4); // Limit to 4 categories if more exist

// Populate the container
relatedContainer.innerHTML = ""; // Clear any existing content
selectedProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('related-product');

    productCard.innerHTML = `
        <div class="product-card">
            <img src="${product.image}" alt="${product.productName}">
            <h4>${product.productName}</h4>
            <p>$${product.price}</p>
           <button class="add-to-cart" data-id="${product.item}">Add to Cart</button>
        </div>
    `;

    relatedContainer.appendChild(productCard);
});
// Add event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-id');
        window.location.href = `productDetail.html?id=${productId}`;
    });
});
}

// On DOM load
document.addEventListener('DOMContentLoaded', () => {
    const productID = new URLSearchParams(window.location.search).get('id');
    if (productID) {
        displayRelatedProducts(productID);
    }
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0); // Sum quantities
    const cartCountElement = document.getElementById('cartCount');

    if (count > 0) {
        cartCountElement.textContent = count;
        cartCountElement.style.display = 'inline'; // Show the count
    } else {
        cartCountElement.style.display = 'none'; // Hide if no items
    }
}

// Call this function on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
// Handle "Add to Cart" button
document.getElementById('addToCartButton').addEventListener('click', () => {
    const selectedSize = document.getElementById('size').value;
    const selectedColor = document.getElementById('color').value;
    const quantity = document.getElementById('quantity').value;

    const cartItem = {
        id: product.item,
        name: product.productName,
        size: selectedSize,
        color: selectedColor,
        quantity: parseInt(quantity, 10),
        price: product.price,
        image: product.image, // Include the image URL
    };

    // Save to cart (localStorage for simplicity)
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();


    alert('Product added to cart!');
    window.location.href = 'cart.html'; // Redirect to cart page
});


// email
(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '1203249');