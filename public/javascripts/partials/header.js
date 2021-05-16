$("#login-button").click(() => {
  $("#login-form").css({ display: "inline-block" });
});
$("#register-button").click(() => {
  $("#register-form").css({ display: "inline-block" });
});
$("#register-form .close-svg").click(() => {
  $("#register-form").css({ display: "none" });
});
$("#login-form .close-svg").click(() => {
  $("#login-form").css({ display: "none" });
});

$("#logout-button").click(() => {
  console.log("request sent");
  fetch("/login/logout?_method=DELETE", { method: "POST" }).then(() => {
    document.location.reload();
    return false;
  });
});
