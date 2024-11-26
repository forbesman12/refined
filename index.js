(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '1203249');

import { products } from './imagedata.js';
let currentCategory = ''; 

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('productContainer');
    const searchIcon = document.getElementById('searchIcon');
    const searchInput = document.getElementById('searchInput');
    const cartCountElement = document.getElementById('cartCount');
    const addToCartButton = document.getElementById('addToCartButton');

    let currentPage = 1;
    const productsPerPage = 8; // Number of products per page

    function displayProducts(category = '') {
        if (!productContainer) return; 

        console.log(`Displaying products for category: ${category}`);

        // Clear current products
        productContainer.innerHTML = '';

        // Filter products based on category
        const filteredProducts = category
            ? products.data.filter(product => product.category.toLowerCase() === category.toLowerCase())
            : products.data;

        // Calculate the starting and ending index for pagination
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // Populate products
        paginatedProducts.forEach(product => {
            const productCard = createProductCard(product);
            productContainer.appendChild(productCard);
        });

        // Add event listeners to dynamically added "Add to Cart" buttons
        bindAddToCartEvents();

        // Update pagination controls
        updatePaginationControls(filteredProducts.length);
    }

    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.productName}">
            <h3>${product.productName}</h3>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart" data-id="${product.item}">Add to Cart</button>
        `;
        return productCard;
    }

    function bindAddToCartEvents() {
        const buttons = document.querySelectorAll('.add-to-cart');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                window.location.href = `productDetail.html?id=${productId}`;
            });
        });
    }

    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);

        if (cartCountElement) {
            if (count > 0) {
                cartCountElement.textContent = count;
                cartCountElement.style.display = 'inline';
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }

    function updatePaginationControls(totalProducts) {
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        const paginationContainer = document.getElementById('paginationContainer');

        if (!paginationContainer) return;

        // Clear existing pagination controls
        paginationContainer.innerHTML = '';

        // Create Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayProducts();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Display page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.disabled = i === currentPage;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayProducts();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Create Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayProducts();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Handle Search Icon Click
    if (searchIcon && searchInput) {
        searchIcon.addEventListener('click', () => {
            if (searchInput.style.display === 'none') {
                searchInput.style.display = 'inline';
                searchInput.focus();
            } else {
                searchInput.style.display = 'none';
            }
        });

        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();

            const filteredProducts = products.data.filter(product =>
                product.productName.toLowerCase().includes(searchText) ||
                product.category.toLowerCase().includes(searchText)
            );

            productContainer.innerHTML = '';
            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                productContainer.appendChild(productCard);
            });

            bindAddToCartEvents();
            updatePaginationControls(filteredProducts.length);
        });
    }

    // Filter function for category
window.filterItems = (category) => {
    currentCategory = category; // Set current category
    currentPage = 1; // Reset to first page on category change
    
    // If 'All' is selected, pass an empty string to display all products
    if (category === 'all') {
        displayProducts(); // Show all products
    } else {
        displayProducts(category); // Show products of the selected category
    }
};
    // Display all products on page load
    displayProducts();

    // Update cart count on page load
    updateCartCount();
});
