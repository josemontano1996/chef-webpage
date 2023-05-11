window.addEventListener('scroll', function () {
  const startersElement = document.getElementById('starters');
    const hiddenElement = document.querySelector('.hidden');
    const introElement = this.document.getElementById('intro')

  // Calculate the position of the starters element
  const startersPosition = startersElement.getBoundingClientRect().top;

  // Calculate the point of the page
  const breakpoint = window.innerHeight / 2;

  // Toggle the class of the hidden element based on the scroll position
  if (startersPosition <= breakpoint) {
      hiddenElement.classList.add('show');
      startersElement.style.marginBottom = hiddenElement.offsetHeight + 'px';
  } else {
      hiddenElement.classList.remove('show');
       startersElement.style.marginTop = '0';
  }
});
