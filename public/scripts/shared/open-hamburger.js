const hamburgerButtonElement = document.getElementById('hamburger');
const sideNavElement = document.getElementById('side-nav');

hamburgerButtonElement.addEventListener('click', () => {
  const computedStyle = getComputedStyle(sideNavElement);

  sideNavElement.style.display =
    computedStyle.display === 'none' ? 'block' : 'none';
});
