//For managing cart from the menu badge display
let cartItemUpdateFormElements = document.querySelectorAll(
  '.cart-item-management'
);

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
}

//Deleting items from cart
let deleteItemButtons = document.querySelectorAll('.delete-button');

for (const deleteItemButton of deleteItemButtons) {
  deleteItemButton.addEventListener('click', deleteCartItem);
}

//For adding items to the cart from the menu
const addItemForms = document.querySelectorAll('.add-item-form');

for (const addItemForm of addItemForms) {
  addItemForm.addEventListener('submit', addToCart);
}

//For toggling cart display
const closeCartButton = document.getElementById('close-cart');
const cartSectionElement = document.getElementById('cart-section');

const openCartButton = document.querySelector('.cart-banner');
function initializeEventListeners() {}

//I am creating a locals helper variable, this variable will be set uppon ajax request
//for obtaining the cart data, and res.locals data for then using it for creating the html
//content when openCartButton executes

let cartDisplay;

let cartHelper;

if (closeCartButton) {
  closeCartButton.addEventListener('click', () => {
    cartSectionElement.style.display = 'none';
    cartDisplay = false;
  });
}

if (openCartButton) {
  openCartButton.addEventListener('click', (event) => {
    const cartItems = document.querySelector('#cart-items');
    cartSectionElement.style.display = 'block';
    if (cartHelper || cartItems) {
      event.target.closest('h4').textContent = 'To Checkout';
    }
    if (cartDisplay === true) {
      return (window.location.href = '/orders/checkout');
    }
    cartDisplay = true;
  });
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
  const cartBadgeElement = document.querySelector('.cart-banner');
  const cartBadgePrice = document.querySelector('.cart-price');
  const newTotalPrice = responseData.updatedCartData.newTotalPrice;

  if (cartBadgePrice) {
    cartBadgePrice.textContent = newTotalPrice.toFixed(2);
  }

  if (newTotalPrice === 0) {
    cartBadgeElement.style.display = 'none';
  }

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    event.target.closest('.cart-item').remove();
  } else {
    const cartItemTotalPriceElement = event.target
      .closest('.cart-item')
      .querySelector('.cart-item-price');

    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);
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

  if (cartBadgePrice) {
    cartBadgePrice.textContent = newTotalPrice.toFixed(2);
  }

  if (newTotalPrice === 0) {
    cartBadgeElement.style.display = 'none';
  }

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

//Function for cartItemUpdateFormElements

async function addToCart(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const productId = formData.get('productId');
  const quantity = formData.get('quantity');
  const csrfToken = formData.get('csrf');

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
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
    alert('Something went wrong 1');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong');
    return;
  }

  const responseData = await response.json();

  cartHelper = responseData.locals.cart;

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

    newSectionElement.addEventListener('click', (event) => {
      let locals;

      fetch('/cart/flash', {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          locals = data.locals;
          cartSectionElement.style.display = 'block';
          event.target.closest('h4').textContent = 'To Checkout';
          if (cartDisplay === true) {
            return (window.location.href = '/orders/checkout');
          }
          cartDisplay = true;

          const cartDataElement = document.getElementById('cart-data');

          const cartTemplate = `
        <ul id="cart-items">
          <% for (const item of cart.items) { %>
            <li class="cart-item">
            <article>
            <h3><%= item.product.name %></h3>
            <div class="cart-item-info">
              <label for="quantity">Quantity</label>
              <form class="cart-item-management"  data-productid="<%= item.product.id %>" data-csrf="<%= locals.csrfToken %>">
                <input
                  type="number"
                  id="quantity"
                  value="<%= item.quantity %>"
                   min="<%=item.product.minQuantity %>"
                  step="1"
                  required
                />
                <button class="btn">Update</button>
                 <a class="btn alt delete-button" data-productid="<%= item.product.id %>" data-csrf="<%= locals.csrfToken %>">Delete</a>
              </form>
              </div>
              <p>
                <span class="cart-item-price"> <%= item.totalPrice.toFixed(2) %> </span>
                &euro;<span>(<%= item.product.price %> &euro; per ud.)</span>
              </p>
              <hr>
          </article>
          </li>
          <% } %>
        </ul>
        <div id="cart-total">Total: <span id="cart-total-price"><%= cart.totalPrice %> &euro;</span></div>
        <% if (typeof isAuth === 'undefined' || !isAuth) { %>
          <p class="disclaimer">You must <a href="/auth"><span>log in</span> or <span>create an account</span></a> to make an order</p>
        <% } else if (cart.totalPrice === 0) { %>
          <p class="disclaimer">Your cart is empty, <a href="/menu">check our Menu</a> to make an order</p>
        <% } %>
      `;
          const renderedHTML = ejs.render(cartTemplate, locals);
          cartDataElement.innerHTML = renderedHTML;

          cartItemUpdateFormElements = document.querySelectorAll(
            '.cart-item-management'
          );

          for (const formElement of cartItemUpdateFormElements) {
            formElement.addEventListener('submit', updateCartItem);
          }

         deleteItemButtons = document.querySelectorAll('.delete-button');

          for (const deleteItemButton of deleteItemButtons) {
            deleteItemButton.addEventListener('click', deleteCartItem);
          }

        })
        .catch((error) => {
          console.log(error);
        });
    });

    //Updating or deleting bottom badge element
    closeCartButton.addEventListener('click', () => {
      cartSectionElement.style.display = 'none';
    });
  } else {
    cartPriceElement.textContent = newTotalPrice;
  }
}
