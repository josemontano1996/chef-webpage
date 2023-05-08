const updateStatusFormElements = document.querySelectorAll('.order-status');

for (const updateStatusFormElement of updateStatusFormElements) {
  updateStatusFormElement.addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;

    const formData = new FormData(form);
    const newStatus = formData.get('status');
    const orderId = formData.get('orderid');

    const csrfToken = form.dataset.csrf;

    let response;
    try {
      response = await fetch('/admin/orders/status/' + orderId, {
        method: 'PATCH',
        body: JSON.stringify({
          newStatus: newStatus,
          _csrf: csrfToken,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      alert('Something went wrong - could not update status.');
      return;
    }

    if (!response.ok) {
      alert('Something went wrong - could not update status.');
      return;
    }

    const formLi = form.closest('.order-li');
    formLi.style.display = 'none';
  });
}
