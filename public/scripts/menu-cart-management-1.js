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

const openCartButton = document.querySelector('.cart-banner');

//I am creating a locals helper variable, this variable will be set uppon ajax request
//for obtaining the cart data, and res.locals data for then using it for creating the html
//content when openCartButton executes

let locals;
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
    }

    cartSectionElement.style.display = 'block';
    cartDisplay = true;
    const cartContentElement = document.createElement('div');
    cartContentElement.innerHTML = `
        <ul id="cart-items" class="imworking">
          <% for (const cartItem of ${locals.cart.items}){ %>
            <li class="cart-item"><%- include("includes/cart-item", {item: cartItem}) %></li>
          <% } %>
        </ul>
        <div id="cart-total"> Total: <span id="cart-total-price"><%= ${locals.cart.totalPrice} %></span> &euro; </div>
        <% if(!${locals.isAuth}){ %>
          <p class="disclaimer">You must  <a href="/auth"> <span>log in </span> or <span>create an account</span> </a> to make an order </p>
        <% } else if (${locals.cart.totalPrice}) { %>
          <h4><a class="btn" href="/orders/checkout">To checkout</a></h4>
        <% } else { %>
          <p class="disclaimer">Your cart is empty, <a href="/menu"> check our Menu </a>to make an order </p>
        <% } %>
          `;

    cartSectionElement.appendChild(cartContentElement);
    
    const previousScript = document.getElementById('script-1');
    if (previousScript) {
      previousScript.remove();
    }

    const scriptElement = document.createElement('script');
    scriptElement.id = 'script-2'
    scriptElement.src = '/scripts/menu-cart-management-2.js';
    scriptElement.defer = true;
    document.head.appendChild(scriptElement);
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

  locals = responseData.locals;

  console.log(locals.cart);

  const newTotalPrice = responseData.locals.cart.totalPrice;

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

    const previousScript = document.getElementById('script-1');
    if (previousScript) {
      previousScript.remove();
    }

    const scriptElement = document.createElement('script');
    scriptElement.id= 'script-2'
    scriptElement.src = '/scripts/menu-cart-management-2.js';
    scriptElement.defer = true;
    document.head.appendChild(scriptElement);

  } else {
    cartPriceElement.textContent = newTotalPrice;
  }
}
