const validateEmail = (value: string | undefined) => {
  if (!value) {
    return false;
  }
  // Use a safer regex without nested quantifiers to prevent ReDoS
  return /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value);
};

const validateUrl = (value: string | undefined) => {
  if (!value) {
    return false;
  }
  return /^(?:(ftp|http|https)?:\/\/)?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,}(?:\/.*)?$/gi.test(value);
};

const validatePhone = (value: string | undefined) => {
  if (!value) {
    return false;
  }
  return /^\+?(\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(value);
};

export default {
  validateEmail,
  validateUrl,
  validatePhone,
};
