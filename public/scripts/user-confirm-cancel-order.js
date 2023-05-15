const confirmCancelProductButtonElements = document.querySelectorAll(
  '.confirm-cancel-button'
);

async function cancelOrder(event) {
  event.preventDefault();
  const orderId = event.target.dataset.orderid;
  const csrfToken = event.target.dataset.csrf;

  let response;
  try {
    response = await fetch('/orders/' + orderId, {
      method: 'PATCH',
      body: JSON.stringify({
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
    alert(
      'Something went wrong! We could not cancel your order. Please contact the chef in regard to this error'
    );
    return;
  }

  const listItemElement = event.target.closest('.order-li');
  const statusElement = listItemElement.querySelector('.order-status');

  statusElement.innerHTML = 'Status: cancellation requested';

  alert('Cancellation succesfully requested.')
}

for (const confirmCancelProductButtonElement of confirmCancelProductButtonElements) {
  confirmCancelProductButtonElement.addEventListener('click', cancelOrder);
}
