let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
        total += item.price;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toLocaleString('vi-VN')} VND</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Xóa</button></td>
        `;
        cartItems.appendChild(row);
    });
    document.getElementById('total-price').innerText = `Tổng cộng: ${total.toLocaleString('vi-VN')} VND`;
    updateCartCount();
}
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}
document.addEventListener('DOMContentLoaded', function() {
                    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
});
function addToCart(productName, price) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.');
        window.location.href = 'login.html';
        return;
    }
    cart.push({ name: productName, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} đã được thêm vào giỏ hàng!`);
   updateCartDisplay();
   updateCartCount();

}
function logout() {
    
    localStorage.removeItem('loggedInUser'); 
    alert('Bạn đã đăng xuất thành công!');
    window.location.href = 'login.html'; 
}







function navigateTo(page) {
    if (page === 'login') {
      
        window.location.href = 'login.html'; 
    } else if (page === 'register') {
        
        window.location.href = 'register.html'; 
    }
    else {
        alert('Trang không tồn tại!');
    }
}
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
document.querySelector('form').addEventListener('submit', function(event) {
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
});
