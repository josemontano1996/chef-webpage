const deleteButtonElements = document.querySelectorAll('.delete-button');

function showConfirmButton(event) {
  const deleteButton = event.target;
  const confirmDeleteButton = deleteButton.parentElement.querySelector(
    '.confirm-delete-button'
  );
  deleteButton.style.display = 'none';
  confirmDeleteButton.style.display = 'block';
}

for (const deleteButtonElement of deleteButtonElements) {
  deleteButtonElement.addEventListener('click', showConfirmButton);
}
