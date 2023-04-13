const addItemButtonElements = document.querySelectorAll('#product-item-button');
const cartElement = document.querySelector('.cart');
const cartPriceElement = document.querySelector('.cart-price');

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

  if (!cartElement) {
    const newSectionElement = document.createElement('section');
    newSectionElement.classList.add('cart');
    newSectionElement.innerHTML = `
        <a href="/cart"><span>
          <img src="/img/cart-icon-button.png" alt="cart" />
          <h4>Your Cart (<span class="cart-price">${newTotalPrice}</span>&euro;)</h4>
        </span></a>
      `;
    document.body.appendChild(newSectionElement);
  } else {
    cartPriceElement.textContent = newTotalPrice;
  }
}

for (const addItemButtonElement of addItemButtonElements) {
  addItemButtonElement.addEventListener('click', addToCart);
}
