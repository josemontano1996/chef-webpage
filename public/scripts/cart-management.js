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
  console.log(responseData);
  const newTotalPrice = responseData.newTotalPrice;

  //creating dinamic gif and badge
  if (newTotalPrice > 0) {
    //creating badge
    const closeCartButton = document.getElementById('close-cart');
    const cartSectionElement = document.getElementById('cart-section');

    const newSectionElement = document.createElement('section');
    newSectionElement.classList.add('cart');
    newSectionElement.classList.add('open-cart');
    newSectionElement.innerHTML = `
        <a><span class="badge">
           <i class="bi bi-bag-fill"></i>
            <h4>Your Cart (<span class="cart-price">${newTotalPrice}</span>&euro;)</h4>
            </span>
          </a>
      `;

    document.body.appendChild(newSectionElement);

    newSectionElement.addEventListener('click', () => {
      cartSectionElement.style.display = 'block';
    });

    closeCartButton.addEventListener('click', () => {
      cartSectionElement.style.display = 'none';
    });
  } else {
    cartPriceElement.textContent = newTotalPrice;
  }
}

for (const addItemButtonElement of addItemButtonElements) {
  addItemButtonElement.addEventListener('click', addToCart);
}
