const addItemButtonElements = document.querySelectorAll('#product-item-button');
const cartPriceElement = document.querySelector('#cart-price');

async function addToCart(event) {
  const productId = event.target.dataset.productid;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong 1');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong 2');
    return;
  }

  const responseData = await response.json();

  const newTotalPrice = responseData.newTotalPrice;

  cartPriceElement.textContent = newTotalPrice;
}

for (addItemButtonElement of addItemButtonElements) {
  addItemButtonElement.addEventListener('click', addToCart);
}
