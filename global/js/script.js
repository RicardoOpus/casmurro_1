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

function convertDateUS(dateUS) {
  const date = dateUS;
  const [day, month, year] = date.split('/');
  const dateBR = [year, month, day].join('-');;
  return dateBR;
}

function restoreBackground() {
  document.body.style.backgroundImage = "url('../../assets/images/arabesque3.png')";
}

function changeTabColor(tabName) {
  var tab = document.getElementById(tabName);
  // tab.style.backgroundColor = "#121214"
  tab.classList.add("tabActive")
  tab.classList.remove("tabInactive")
}

// pageChange('#dinamicPage', 'components/projects/editProject.html', 'components/projects/script.js')