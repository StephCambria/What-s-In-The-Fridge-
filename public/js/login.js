const loginFormHandler = async function(event) {
  event.preventDefault();

  const username = document.querySelector("#username-login");
  const password = document.querySelector("#password-login");

  const response = await fetch ("/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
    headers: { "Content-Type": "application/json" },
  });


  if (response.ok) {
    document.location.replace("/fridge");
  } else {
    alert(response.statusText);
  }
};

document
  .querySelector("#login-btn")
  .addEventListener("click", loginFormHandler);