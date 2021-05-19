$("#login-button").click(() => {
  $("#login-form").css({ display: "inline-block" });
  $("#login-form").removeClass("fadeOut");
  $("#login-form").addClass("fadeIn");
});
$("#register-button").click(() => {
  $("#register-form").css({ display: "inline-block" });
  $("#register-form").removeClass("fadeOut");
  $("#register-form").addClass("fadeIn");
});
$("#register-form .close-svg").click(() => {
  $("#register-form").removeClass("fadeIn");
  $("#register-form").addClass("fadeOut");
  setTimeout(() => {
    $("#register-form").css({ display: "none" });
  }, 500);
});
$("#login-form .close-svg").click(() => {
  $("#login-form").removeClass("fadeIn");
  $("#login-form").addClass("fadeOut");
  setTimeout(() => {
    $("#login-form").css({ display: "none" });
  }, 500);
});

$("#logout-button").click(() => {
  console.log("request sent");
  fetch("/login/logout?_method=DELETE", { method: "POST" }).then(() => {
    document.location.reload();
    return false;
  });
});
