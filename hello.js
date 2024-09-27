let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}
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
}
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
}
document.addEventListener('DOMContentLoaded', function() {
                    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay(cart);
});

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