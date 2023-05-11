const scrollElement = document.querySelectorAll('.smooth-scroll');

scrollElement.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const hrefValue = link.getAttribute('href');
    const section = document.querySelector(hrefValue);
    const scrollNavbarHeight =
      document.querySelector('header').offsetHeight;
    window.scrollTo({
      top:  section.offsetTop - (1.2 * scrollNavbarHeight),
      behavior: 'smooth',
    });
  });
});
