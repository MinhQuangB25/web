// Constants
const ITEMS_PER_PAGE = 3;

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;

// Product data
const products = [
    { name: 'Laptop Dell XPS 13', category: 'Dell', price: 25000000, imgSrc: 'https://anphat.com.vn/media/product/40665_laptop_dell_xps_13_9310_70273578__1_.jpg' },
    { name: 'Laptop MacBook Pro', category: 'Apple', price: 35000000, imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTASeYxNtoDAGQ21Mc-VGbV5Q2ElLl2VWCFH2qj5ZNMJbySuCQ&s' },
    { name: 'Laptop HP Spectre', category: 'HP', price: 30000000, imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDtr3nS3SJChOJD5Q-5ZihQpS62UOLsIAv3tzY-7Zq0AR6EDW7&s' },
    { name: 'Laptop Legion 5 Pro', category: 'Lenovo', price: 30690000, imgSrc: 'https://thegioiso365.vn/wp-content/uploads/2023/04/Legion-5-Pro-Y9000P-1.png' },
    { name: 'Laptop Lenovo Ideapad Slim 5', category: 'Lenovo', price: 15890000, imgSrc: 'https://bizweb.dktcdn.net/thumb/large/100/372/934/products/lenovo-ideapad-slim-5-16imh9-man-hinh-cc8ad94d-bc74-4317-95bc-34e5af02acec.jpg?v=1721666121553' },
    { name: 'Laptop Lenovo LOQ', category: 'Lenovo', price: 21290000, imgSrc: 'https://cdn.hoanghamobile.com/i/preview/Uploads/2024/01/23/83gs001rvn-1.png' },
    { name: 'Laptop Dell Inspiron 15', category: 'Dell', price: 16490000, imgSrc: 'https://cdn.hoanghamobile.com/i/preview/Uploads/2024/02/17/dell-inspiron-15-3520-black-4.png' },
    { name: 'Laptop Dell G15', category: 'Dell', price: 19900000, imgSrc: 'https://cdn.tgdd.vn/Products/Images/44/269650/dell-gaming-g15-5515-r7-5800h-8gb-512gb-4gb-rtx3050-120hz-600x600.jpg' },
    { name: 'Laptop HP Pavilion15', category: 'HP', price: 17690000, imgSrc: 'https://anphat.com.vn/media/product/46267_laptop_hp_pavilion_15_eg3092tu_8c5l3pa__anphatpc_34.jpg' },
    { name: 'Laptop HP Gaming Victus 15', category: 'HP', price: 17690000, imgSrc: 'https://cdn.hoanghamobile.com/i/content/Uploads/2024/02/16/gaming-hp-victus-15-fb1023ax-1.jpg' },
    { name: 'Apple MacBook Air M1', category: 'Apple', price: 18490000, imgSrc: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2020_11_12_637407970062806725_mba-2020-gold-dd.png' },
    { name: 'Apple MacBook Air M2', category: 'Apple', price: 23990000, imgSrc: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034' }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    const path = window.location.pathname;
    if (path.includes('history.html')) {
        displayOrderHistory();
    } else if (path.includes('cart.html')) {
        generateOrderSummary();
        updateCartDisplay();
    } else if (path.includes('hello.html') || path === '/') {
        displayFilteredProducts(products);
        setupPagination(products);
        setupCategoryListeners();
        setupSearchForm();
    }
    updateCartCount();
    updateLoginStatus();
}

// Cart Functions
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const row = createCartItemRow(item, index);
        cartItems.appendChild(row);
    });
    document.getElementById('total-price').innerText = `Tổng cộng: ${total.toLocaleString('vi-VN')} VND`;
    updateCartCount();
}

function createCartItemRow(item, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price.toLocaleString('vi-VN')} VND</td>
        <td>
            <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)" class="form-control form-control-sm" style="width: 60px;">
        </td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Xóa</button></td>
    `;
    return row;
}

function addToCart(productName, price) {
    let item = cart.find(product => product.name === productName);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} đã được thêm vào giỏ hàng!`);
    updateCartDisplay();
    updateCartCount();
}

function removeFromCart(index) {
    const confirmation = confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?');
    if (confirmation) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        generateOrderSummary();
    } else {
        alert('Hủy thao tác xóa.');
    }
}

function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        alert('Số lượng phải lớn hơn 0.');
        return;
    }
    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    generateOrderSummary();
}

// Order Functions
function generateOrderSummary() {
    const orderSummaryElement = document.getElementById('order-summary');
    if (!orderSummaryElement) {
        console.log("Không tìm thấy phần tử có id 'order-summary'");
        return;
    }
    if (cart.length === 0) {
        orderSummaryElement.innerHTML = '<p>Giỏ hàng trống, không có hóa đơn để hiển thị.</p>';
        return;
    }
    let totalAmount = 0;
    let summaryHtml = '<table class="table table-striped">';
    summaryHtml += '<thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th></tr></thead><tbody>';
    cart.forEach(item => {
        totalAmount += item.price * item.quantity;
        summaryHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${(item.price * item.quantity).toLocaleString('vi-VN')} VND</td>
            </tr>
        `;
    });
    summaryHtml += '</tbody></table>';
    summaryHtml += `<p class="fw-bold">Tổng cộng: ${totalAmount.toLocaleString('vi-VN')} VND</p>`;
    orderSummaryElement.innerHTML = summaryHtml;
}

function saveOrderHistory(cart, address, paymentMethod) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) return;
    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || {};
    if (!orderHistory[loggedInUser]) {
        orderHistory[loggedInUser] = [];
    }
    const order = {
        date: new Date().toLocaleString(),
        items: cart,
        address: address,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod: paymentMethod // Thêm phương thức thanh toán vào đơn hàng
    };
    orderHistory[loggedInUser].push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

function displayOrderHistory() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const orderHistoryElement = document.getElementById('order-history');
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || {};
    const userOrders = orderHistory[loggedInUser] || [];
    if (userOrders.length === 0) {
        orderHistoryElement.innerHTML = '<p>Bạn chưa có đơn hàng nào.</p>';
        return;
    }
    let historyHtml = '';
    userOrders.forEach(order => {
        // Chuyển đổi phương thức thanh toán sang tiếng Việt
        let paymentMethodVi = '';
        switch (order.paymentMethod) {
            case 'cash':
                paymentMethodVi = 'Tiền mặt';
                break;
            case 'transfer':
                paymentMethodVi = 'Chuyển khoản ngân hàng';
                break;
            case 'card':
                paymentMethodVi = 'Thanh toán qua thẻ';
                break;
            default:
                paymentMethodVi = order.paymentMethod;
        }

        historyHtml += `
            <div class="order-summary">
                <p><strong>Ngày đặt hàng:</strong> ${order.date}</p>
                <p><strong>Địa chỉ giao hàng:</strong> ${order.address}</p>
                <p><strong>Phương thức thanh toán:</strong> ${paymentMethodVi}</p>
                <ul>
        `;
        order.items.forEach(item => {
            historyHtml += `<li>${item.name} - Số lượng: ${item.quantity} - Giá: ${(item.price * item.quantity).toLocaleString('vi-VN')} VND</li>`;
        });
        historyHtml += `
                </ul>
                <p><strong>Tổng cộng:</strong> ${order.total.toLocaleString('vi-VN')} VND</p>
                <hr>
            </div>
        `;
    });
    orderHistoryElement.innerHTML = historyHtml;
}

// Search and Display Functions
function performAdvancedSearch() {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const minPrice = document.getElementById('minPrice').value || 0;
    const maxPrice = document.getElementById('maxPrice').value || Infinity;
    
    const filteredProducts = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(query);
        const matchCategory = category ? product.category === category : true;
        const matchPrice = product.price >= minPrice && product.price <= maxPrice;
        return matchName && matchCategory && matchPrice;
    });

    currentPage = 1;
    displayFilteredProducts(filteredProducts);
    setupPagination(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    const resultsContainer = document.getElementById('search-result');
    if (!resultsContainer) {
        console.error("Không tìm thấy phần tử có id 'search-result'");
        return;
    }
    resultsContainer.innerHTML = '';

    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = '<p>Không có sản phẩm phù hợp</p>';
        return;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productDiv = createProductElement(product);
        resultsContainer.appendChild(productDiv);
    });
}

function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.className = 'col';
    productElement.innerHTML = `
        <div class="card h-100">
            <img src="${product.imgSrc}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">Giá: ${product.price.toLocaleString('vi-VN')} VND</p>
                <button class="btn btn-primary" onclick="handleAddToCart('${product.name}', ${product.price})">Thêm vào giỏ hàng</button>
            </div>
        </div>
    `;
    return productElement;
}

function handleAddToCart(productName, price) {
    if (isLoggedIn()) {
        addToCart(productName, price);
    } else {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
        window.location.href = 'login.html';
    }
}

function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}

function setupPagination(filteredProducts) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        console.error("Không tìm thấy phần tử có id 'pagination'");
        return;
    }
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = createPaginationItem(i, filteredProducts);
        paginationContainer.appendChild(pageItem);
    }
}

function createPaginationItem(pageNumber, filteredProducts) {
    const pageItem = document.createElement('li');
    pageItem.className = `page-item ${currentPage === pageNumber ? 'active' : ''}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${pageNumber}</a>`;
    pageItem.addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = pageNumber;
        displayFilteredProducts(filteredProducts);
        setupPagination(filteredProducts);
    });
    return pageItem;
}

function filterByCategory(category) {
    let filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    currentPage = 1;
    displayFilteredProducts(filteredProducts);
    setupPagination(filteredProducts);
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        localStorage.setItem('loggedInUser', email);
        alert('Đăng nhập thành công!');
        window.location.href = 'hello.html';
    } else {
        alert('Email hoặc mật khẩu không đúng.');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công!');
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('loggedInUser');
    alert('Bạn đã đăng xuất thành công!');
    updateLoginStatus(); // Thêm dòng này
    window.location.href = 'hello.html';
}

// Navigation Function
function navigateTo(page) {
    if (page === 'login' || page === 'register') {
        window.location.href = `${page}.html`;
    } else {
        alert('Trang không tồn tại!');
    }
}

// Payment Handling
function setupPaymentHandling() {
    const cashPayment = document.getElementById('cashPayment');
    const bankTransfer = document.getElementById('bankTransfer');
    const cardPayment = document.getElementById('cardPayment');
    const cardDetailsForm = document.getElementById('cardDetailsForm');

    function toggleCardForm() {
        cardDetailsForm.style.display = cardPayment.checked ? 'block' : 'none';
    }

    [cashPayment, bankTransfer, cardPayment].forEach(el => el.addEventListener('change', toggleCardForm));

    toggleCardForm();

    window.placeOrder = function () {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        let address = '';

        // Kiểm tra xem người dùng đã chọn địa chỉ đã lưu hay địa chỉ mới
        const savedAddressOption = document.getElementById('savedAddressOption');
        if (savedAddressOption && savedAddressOption.checked) {
            // Sử dụng địa chỉ đã lưu
            address = document.getElementById('savedAddress').textContent;
        } else {
            // Sử dụng địa chỉ mới
            const addressLine = document.getElementById('addressLine').value;
            const district = document.getElementById('district').value;
            const city = document.getElementById('city').value;

            if (!addressLine || !district || !city) {
                alert('Vui lòng nhập đầy đủ thông tin địa chỉ giao hàng.');
                return;
            }

            address = `${addressLine}, ${district}, ${city}`;
        }

        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardNumber || !expiryDate || !cvv) {
                alert('Vui lòng nhập đầy đủ thông tin thẻ.');
                return;
            }

            console.log('Processing card payment with details:', { cardNumber, expiryDate, cvv });
        }

        console.log('Selected payment method:', paymentMethod);
        console.log('Delivery address:', address);
        
        saveOrderHistory(cart, address, paymentMethod);
        cart = [];
        localStorage.removeItem('cart');
        updateCartDisplay();
        updateCartCount();
        alert('Đặt hàng thành công!');
        window.location.href = 'history.html';
    };
}

// Helper Functions
function setupCategoryListeners() {
    const categoryLinks = document.querySelectorAll('#category-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
}

function setupSearchForm() {
    const searchForm = document.getElementById('advancedSearchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            performAdvancedSearch();
        });
    }
}

// Initialize payment handling
document.addEventListener('DOMContentLoaded', setupPaymentHandling);

// Thêm hàm này vào phần cuối của file
function updateLoginStatus() {
    const userEmailElement = document.getElementById('user-email');
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (userEmailElement) {
        userEmailElement.textContent = loggedInUser || 'Chưa đăng nhập';
    }
}