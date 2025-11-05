// toggle
const hamburger = document.querySelector(".hamburger");
const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector(".close-btn");

// Open sidebar
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  sidebar.classList.add("active");
});

// Close sidebar
closeBtn.addEventListener("click", () => {
  hamburger.classList.remove("active");
  sidebar.classList.remove("active");
});

// form validation

const form = document.getElementById("Form");
const sendButton = document.querySelector(".send-button");


const inputs = {
  firstname: form.querySelector('input[name="firstname"]'),
  lastname: form.querySelector('input[name="lastname"]'),
  email: form.querySelector('input[name="email"]'),
  phone: form.querySelector('input[name="phonenumber"]'),
  message: form.querySelector('textarea[name="message"]'),
};


const errors = {
  firstname: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  phone: document.getElementById("phoneError"),
};


const patterns = {
  email: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?\d{10,13}$/,
};

// Validate individual fiel
function validateField(field) {
  const value = inputs[field].value.trim();
  let valid = true;

  switch (field) {
    case "firstname":
      valid = value.length >= 3;
      break;
    case "email":
      valid = patterns.email.test(value);
      break;
    case "phone":
      valid = patterns.phone.test(value);
      break;
  }

  
  if (!valid) {
    inputs[field].classList.add("invalid");
    inputs[field].classList.remove("valid");
    if (errors[field]) {
      errors[field].classList.add("show");
      errors[field].style.maxHeight = errors[field].scrollHeight + "px";
    }
  } else {
    inputs[field].classList.add("valid");
    inputs[field].classList.remove("invalid");
    if (errors[field]) {
      errors[field].classList.remove("show");
      errors[field].style.maxHeight = "0";
    }
  }

  return valid;
}


["firstname", "email", "phone"].forEach((key) => {
  inputs[key].addEventListener("input", () => validateField(key));
  inputs[key].addEventListener("blur", () => validateField(key));
});

// Send Button
sendButton.addEventListener("click", (e) => {
  e.preventDefault();

  const validName = validateField("firstname");
  const validEmail = validateField("email");
  const validPhone = validateField("phone");

  if (validName && validEmail && validPhone) {
    sendButton.textContent = "Sending...";
    sendButton.disabled = true;

    setTimeout(() => {
      alert("Message sent successfully!");

      // Reset all inputs
      Object.values(inputs).forEach((input) => {
        input.value = "";
        input.classList.remove("valid", "invalid");
      });

      Object.values(errors).forEach((err) => {
        err.classList.remove("show");
        err.style.maxHeight = "0";
      });

      sendButton.textContent = "Send Message";
      sendButton.disabled = false;
    }, 800);
  } else {
    alert("Please correct the highlighted fields before sending.");
  }
});