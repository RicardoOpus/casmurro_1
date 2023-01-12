console.log("Chamou Mundo!");

$("#Header").load("components/navbar/navbar.html", function () {
  $.getScript("components/navbar/script.js", function () {
  });
  changeTabColor("mundo");
});
