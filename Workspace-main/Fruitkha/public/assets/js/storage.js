$(document).ready(function () {
  const loginForm = $("#loginForm");
  const userEmail = $("#uEmail");
  const userPassword = $("#uPassword");
  const userName = $("#userName");
  
  loginForm.submit(function (event) {
    event.preventDefault();
    
    $.ajax({
      url: "http://localhost:3000/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        uEmail: userEmail.val(),
        uPassword: userPassword.val(),
      }),

      success: function (result) {
        if (result.Code === "1" && result.Data) {
          console.log("Token", result.Data.token);
          sessionStorage.setItem("Email", userEmail.val());
          sessionStorage.setItem("Token", result.Data.token);
          
          if (userName.length) {
            userName.text(userEmail.val());
            welcomeMessage.css("display", "block");
          }
          window.location.href = "/index";
          toastr.success("Request succeeded!", "Success");
        } else {
          console.log("Token is not found or invalid token");
        }
      },
      error: function(xhr, status, error) { // The error callback function
        toastr.error(xhr.responseJSON.error, "Error")
        // toastr.error("An error occurred!", "Error");
        console.log("Error:", status, error);
        // Handle errors here
      },
      complete: function() {       // The complete callback function (optional)
        console.log("Request complete");
        // This is called regardless of success or error
      }
    });
  });
});
