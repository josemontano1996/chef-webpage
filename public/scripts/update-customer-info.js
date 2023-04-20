const form = document.getElementById('updateInfoForm');
const sucessSection = document.querySelector('.success');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const userId = event.target.dataset.userid;

  try {
    const response = await fetch('/customer/account/' + userId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (!response.ok) {
      alert('Something went wrong 2!');
      return;
    }
    const data = await response.json();
    alert(data.statusMessage);
  } catch (error) {
    console.log(error);
    return;
  }
});
