const deleteProductButtonElements = document.querySelectorAll(
  '.product-item button'
);

async function deleteProduct(event) {
  const productId = event.target.dataset.productid;

  const response = await fetch('/admin/menu/' + productId, {
    //in the url should come at the end the '?_csrf=' + dataset.csrf (we have to add it in the html data)
    method: 'DELETE',
  });

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  const productItemElement = event.target.closest('.menu-item');

  productItemElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}