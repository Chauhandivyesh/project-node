const logoutButton = document.getElementById("logoutButton"); // Assuming you have a logout button

function btnclick(params) {
  console.log("clled");
  fetch("http://localhost:3000/logout")
    .then((res) => res.json())
    .then((result) => {
      console.log("inside success");
      if (result.Code === "0") {
        console.log("inside if");
        // alert("Called");
        // Clear session storage
        sessionStorage.removeItem("Email");
        sessionStorage.removeItem("Token");
        window.location.href = "/login";
      }
    });
}

// btnclick();