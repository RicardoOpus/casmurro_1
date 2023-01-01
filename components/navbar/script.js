$(document).on("click", ".navtrigger", function () {
  action = $(this).data("action");
  $("#navigation-side-nav").html('')
  loadpage(action)
})

function loadpage (pagename) {
  $("#dinamicPage").load("pages/" + pagename + "/page.html", function () {
    $.getScript("pages/" + pagename + "/script.js", function () {
    });
  });
}