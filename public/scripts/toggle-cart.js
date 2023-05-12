const closeCartButton = document.getElementById('close-cart');
const cartSectionElement = document.getElementById('cart-section');

const openCartButtons = document.querySelectorAll('.open-cart');

closeCartButton.addEventListener('click', () => {
  cartSectionElement.style.display = 'none';
});

for (const openCartButton of openCartButtons) {
  openCartButton.addEventListener('click', () => {
    cartSectionElement.style.display = 'block';
  });
}

//FROM HERE!!!!!!!

const cartItemUpdateFormElements = document.querySelectorAll(
  '.cart-item-management'
);
const cartTotalPriceElement = document.querySelector('#cart-total-price');
const cartBadgeElement = document.querySelector('.cart');

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;
  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'PATCH',
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong');
    return;
  }

  const responseData = await response.json();

  console.log(responseData);
  const newTotalPrice = responseData.updatedCartData.newTotalPrice;

  if (newTotalPrice === 0) {
    cartBadgeElement.style.display = 'none';
  }

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    form.closest('.cart-item').remove();
  } else {
    const cartItemTotalPriceElement = form
      .closest('.cart-item-info')
      .querySelector('.cart-item-price');

    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
}
