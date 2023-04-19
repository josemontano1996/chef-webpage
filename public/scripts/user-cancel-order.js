const deleteButtonElements = document.querySelectorAll('.cancel-button');

function showConfirmButton(event) {
  const deleteButton = event.target;
  const confirmDeleteButton = deleteButton.parentElement.querySelector(
    '.confirm-cancel-button'
  );
  deleteButton.style.display = 'none';
  confirmDeleteButton.style.display = 'block';
}

for (const deleteButtonElement of deleteButtonElements) {
  deleteButtonElement.addEventListener('click', showConfirmButton);
}
