var loadFile = function (event) {
  var image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};

$(document).ready(function () {
  const editForm = $("#editForm");
  const lastname = $("#uLastname");
  const phone = $("#uPhone");
  const file = $("#uFile");
  const addr = $("#uAddress");
  const city = $("#uCity");
  const code = $("#uCode");
  const password = $("#uPassword");
  const cPassword = $("#uConfirmPassword")

  console.log('before btn click');
  editForm.submit(function (event) {
    event.preventDefault();
    console.log('after btn click');
    
    $.ajax({
      url: "http://localhost:3000/editpage",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        uLastname: lastname.val(),
        uPhone: phone.val(),
        uFile: file.val(),
        uAddress: addr.val(),
        uCity: city.val(),
        uCode: code.val(),
        uPassword: password.val(),
        cPassword: cPassword.val()
      }),
      success: function (result) {
        console.log(result);
        console.log('inside success');
        if (result.code === "1") {
          window.location.href = "/index";
        } else {
          console.log("Invalid user");
        }
      },
      error: function (xhr, status, error) {
        console.log("Error:", status, error);
      },
      complete: function () {
        console.log("Request complete");
      },
    });
  });
});
