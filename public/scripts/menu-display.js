window.addEventListener('scroll', function () {
  const menuElement = document.getElementById('menu');
    const hiddenElement = document.querySelector('.hidden');

  // Calculate the position of the starters element
  const menuPosition = menuElement.getBoundingClientRect().top;

  // Calculate the point of the page
  const breakpoint = window.innerHeight / 2;

  // Toggle the class of the hidden element based on the scroll position
  if (menuPosition <= breakpoint) {
      hiddenElement.classList.add('show');
      menuElement.style.marginBottom = hiddenElement.offsetHeight + 'px';
  } else {
      hiddenElement.classList.remove('show');
       menuElement.style.marginTop = '0';
  }
});
