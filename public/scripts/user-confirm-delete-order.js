const confirmDeleteProductButtonElements = document.querySelectorAll(
  '.confirm-delete-button'
);

async function deleteOrder(event) {
  event.preventDefault();
  const orderId = event.target.dataset.orderid;
  const response = await fetch('/orders/' + orderId, {
    method: 'DELETE',
  });

  if (!response.ok) {
    alert(
      'Something went wrong! We could not delete your order. Please contact the chef in regard to this error'
    );
    return;
  }

  const orderElement = event.target.closest('.order-li');

  orderElement.remove();
}

for (const confirmDeleteProductButtonElement of confirmDeleteProductButtonElements) {
  confirmDeleteProductButtonElement.addEventListener('click', deleteOrder);
}
