const addItemButtonElements = document.querySelectorAll('#product-item-button');
const cartElement = document.querySelector('.cart');
const cartPriceElement = document.querySelector('.cart-price');

async function addToCart(event) {
  const productId = event.target.dataset.productid;
  const csrfToken = event.target.dataset.csrf;
  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
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
console.log(responseData)
  const newTotalPrice = responseData.newTotalPrice;

  //creating dinamic gif and badge
  if (newTotalPrice > 0) {
    //creating badge
    const newSectionElement = document.createElement('section');
    newSectionElement.classList.add('cart');
    newSectionElement.innerHTML = `
        <a href="/cart"><span>
          <i class="bi bi-bag"></i>
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
