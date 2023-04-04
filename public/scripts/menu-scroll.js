const scrollbarNavLinks = document.querySelectorAll('#side-scroll-nav li a');

scrollbarNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const hrefValue = link.getAttribute('href');
    const section = document.querySelector(hrefValue);
    const scrollNavbarHeight =
      document.querySelector('#side-scroll-nav').offsetHeight;
    window.scrollTo({
      top: section.offsetTop - scrollNavbarHeight,
      behavior: 'smooth',
    });
  });
});
