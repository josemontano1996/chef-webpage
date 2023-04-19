const confirmCancelProductButtonElements = document.querySelectorAll(
  '.confirm-cancel-button'
);

async function cancelOrder(event) {
  event.preventDefault();
  const orderId = event.target.dataset.orderid;
  const response = await fetch('/orders/' + orderId, {
    method: 'PATCH',
  });

  if (!response.ok) {
    alert(
      'Something went wrong! We could not cancel your order. Please contact the chef in regard to this error'
    );
    return;
  }

  const listItemElement = event.target.closest('.order-li');
  const statusElement = listItemElement.querySelector('.order-status');

  statusElement.innerHTML = 'Status: Cancellation Requested';

  event.target.style.display = 'none';

  statusElement.classList.add('pop-up');

  setTimeout(() => {
    statusElement.classList.add('done');
    statusElement.classList.remove('pop-up');
  }, 500);
}

for (const confirmCancelProductButtonElement of confirmCancelProductButtonElements) {
  confirmCancelProductButtonElement.addEventListener('click', cancelOrder);
}
