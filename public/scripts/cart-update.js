//Updating cart
const cartItemUpdateFormElements = document.querySelectorAll(
  '.cart-item-management'
);
const cartTotalPriceElement = document.querySelector('#cart-total-price');

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
}

//Deleting items from cart
const deleteItemButtons = document.querySelectorAll('.delete-button');

for (const deleteItemButton of deleteItemButtons) {
  deleteItemButton.addEventListener('click', deleteCartItem);
}

//Functions

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

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    form.closest('.cart-item').remove();
  } else {
    const cartItemTotalPriceElement = form
      .closest('.cart-item')
      .querySelector('.cart-item-price');

    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);
}

async function deleteCartItem(event) {
  const productId = event.target.dataset.productid;
  const csrfToken = event.target.dataset.csrf;

  let response;
  try {
    response = await fetch('/cart/items/delete', {
      method: 'PATCH',
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return alert('Something went wrong');
  }

  if (!response.ok) {
    alert('Something went wrong');
    return;
  }
  
  const responseData = await response.json();

  const cartTotalPriceElement = document.querySelector('#cart-total-price');

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    event.target.closest('.cart-item').remove();
  } else {
    const cartItemTotalPriceElement = event.target
      .closest('.cart-item-info')
      .querySelector('.cart-item-price');

    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);
}
