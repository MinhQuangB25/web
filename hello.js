let cart = [];

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    alert(`${productName} đã được thêm vào giỏ hàng!`);
   updateCartDisplay();
}
function updateCartDisplay()
{
    const cartItems=document.getElementById('cart-items');
    cartItems.innerHTML=' ';
    let total=0;
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
    document.getElementById('total-price').innerText=`Tổng cộng: ${total.toLocaleString('vi-VN')} VND`;
}
function removeFromCart(index)
{
    cart.splice(index,1);
    updateCartDisplay();
}