console.log("Chamou timeline!");
$("#Header").load("components/navbar/navbar.html", function () {
  $.getScript("components/navbar/script.js", function () {
  });
  changeTabColor("timeline");
});