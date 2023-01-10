function pageChange(place, page, script) {
  $(place).load(page, function () {
    $.getScript(script, function () {});
  });
}


async function welcome() {
  const projectActual = await db.settings.toArray();
  if (projectActual[0].currentproject === 0) {
    $("#dinamicPage").load("pages/welcome/page.html", function () {
      $.getScript("pages/welcome/script.js", function () {
    });
});
  } else {
    pageChange('#dinamicPage', 'pages/dashboard/page.html', 'pages/dashboard/script.js')
  }
};

$( document ).ready(function() {
  welcome();
});

function convertToTime(date) {
  const result = date.getHours() + 'h' + date.getMinutes();
  return result;
}

function convertDateBR(date) {
  const result = date.toLocaleDateString('pt-br');
  return result;
}
