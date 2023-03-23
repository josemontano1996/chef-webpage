function isValid(value) {
  return value && value.trim() !== '';
}

function userDetailsAreValid(
  email,
  password,
  name,
  phone,
  street,
  postal,
  city,
  country
) {
  return (
    email &&
    email.includes('@') &&
    password &&
    password.trim().length >= 8 &&
    isValid(name) &&
    isValid(phone) &&
    isValid(street) &&
    isValid(postal) &&
    isValid(city) &&
    isValid(country)
  );
}

function emailsPasswordsMatch(email, confirmEmail, password, confirmPassword) {
  return email === confirmEmail && password === confirmPassword;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailsPasswordsMatch: emailsPasswordsMatch,
};
