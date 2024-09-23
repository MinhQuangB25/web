let cart = [];

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    alert(${productName} đã được thêm vào giỏ hàng!);
    console.log(cart);
}