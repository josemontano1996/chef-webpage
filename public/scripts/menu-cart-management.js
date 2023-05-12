//For managing cart from the menu badge display

const cartItemUpdateFormElements = document.querySelectorAll(
  '.cart-item-management'
);

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
}
//For adding items to the cart from the menu
const addItemButtonElements = document.querySelectorAll('#product-item-button');

for (const addItemButtonElement of addItemButtonElements) {
  addItemButtonElement.addEventListener('click', addToCart);
}

//For toggling cart display
const closeCartButton = document.getElementById('close-cart');
const cartSectionElement = document.getElementById('cart-section');
const cartContentElement = document.querySelector('.cart-content');
const openCartButton = document.querySelector('.cart-banner');

//I am creating a helper cart variable, this variable will be set uppon ajax request
//for obtaining the cart data and then creating the html content when openCartButton executes

let helperCart;
let cartDisplay;

if (closeCartButton) {
  closeCartButton.addEventListener('click', () => {
    cartSectionElement.style.display = 'none';
    cartDisplay = false;
  });
}

  if (openCartButton) {
    openCartButton.addEventListener('click', () => {
      if (cartDisplay === true) {
        return (window.location.href = '/orders/checkout');
      } else {
        cartSectionElement.style.display = 'block';
        cartDisplay = true;
      }
    });
  }


//Function for cartItemUpdateElements
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

  const cartTotalPriceElement = document.querySelector('#cart-total-price');
  const cartBadgeElement = document.querySelector('.cart-banner');
  const cartBadgePrice = document.querySelector('.cart-price');
  const newTotalPrice = responseData.updatedCartData.newTotalPrice;

  cartBadgePrice.textContent = newTotalPrice.toFixed(2);

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

//Function for cartItemUpdateFormElements

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

  helperCart = responseData.cart;

  console.log(helperCart);

  const newTotalPrice = responseData.cart.totalPrice;

  const cartPriceElement = document.querySelector('.cart-price');

  //CREATING BADGE
  if (newTotalPrice > 0) {
    //Creating badge
    const closeCartButton = document.getElementById('close-cart');
    const cartSectionElement = document.getElementById('cart-section');
    const newSectionElement = document.createElement('section');
    newSectionElement.classList.add('cart-banner');
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

    //Updating or deleting bottom badge element
    closeCartButton.addEventListener('click', () => {
      cartSectionElement.style.display = 'none';
    });
  } else {
    cartPriceElement.textContent = newTotalPrice;
  }
}
