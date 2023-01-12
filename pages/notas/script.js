console.log("Chamou Notas!");
$("#Header").load("components/navbar/navbar.html", function () {
  $.getScript("components/navbar/script.js", function () {
  });
  changeTabColor("notas");
});