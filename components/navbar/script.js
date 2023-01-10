function loadpage(pagename) {
  $("#dinamicPage").load("pages/" + pagename + "/page.html", function () {
    $.getScript("pages/" + pagename + "/script.js", function () {
    });
  });
}
