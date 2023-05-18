const deleteProductButtonElements = document.querySelectorAll(
  '.product-item button'
);

async function deleteProduct(event) {
  event.preventDefault();
  const productId = event.target.dataset.productid;
  const csrf = event.target.dataset.csrf;
  const imageUrl = event.target.dataset.imageurl;
  const encodedImageUrl = encodeURIComponent(imageUrl);

  let response;
  try {
    response = await fetch(
      `/admin/menu/${productId}/${csrf}?imageUrl=${encodedImageUrl}`,
      {
        method: 'DELETE',
      }
    );
  } catch (error) {
    alert('Something went wrong');
    return;
  }

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
