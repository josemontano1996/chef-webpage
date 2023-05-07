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
    alert('Something went wrong');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong');
    return;
  }

  const responseData = await response.json();

  const newTotalPrice = responseData.newTotalPrice;

  console.log(newTotalPrice);
  //creating dinamic gif and badge
  if (newTotalPrice > 0) {
    //creating gif
    const cartElement = document.getElementById('cart-img');
    cartElement.src =
      'https://res.cloudinary.com/dfupfbnez/image/upload/c_scale,w_24/v1683452202/ingrid-chef-webpage/icons/output-onlinegiftools_vsk4pz.gif';

    //creating badge
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
