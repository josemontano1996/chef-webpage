const signupButton = document.querySelector('#signup h2');
const loginButton = document.querySelector('#login h2');
const signupSpan = document.getElementById('signup-span');
const loginSpan = document.getElementById('login-span');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

function openSignup() {
  if (signupForm.style.display === 'block') {
    return;
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  }
}

function openLogin() {
  if (loginForm.style.display === 'block') {
    return;
  } else {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  }
}

signupButton.addEventListener('click', openSignup);
loginButton.addEventListener('click', openLogin);
signupSpan.addEventListener('click', openSignup);
loginSpan.addEventListener('click', openLogin);
