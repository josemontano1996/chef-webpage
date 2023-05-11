const closeCartButton = document.getElementById('close-cart');
const cartSectionElement = document.getElementById('cart-section');

const openCartButton = document.getElementById('open-cart');

closeCartButton.addEventListener('click', () => {
  cartSectionElement.style.display = 'none';
});

openCartButton.addEventListener('click', () => {
  cartSectionElement.style.display = 'block';
});
