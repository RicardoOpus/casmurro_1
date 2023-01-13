function pageChange(place, page, script) {
  $(place).load(page, function () {
    $.getScript(script, function () {});
  });
}

function loadpage(pagename) {
  $("#dinamic").load("pages/" + pagename + "/page.html", function () {
    $.getScript("pages/" + pagename + "/script.js", function () {
    });
  });
}

async function welcome() {
  const projectActual = await db.settings.toArray();
  if (projectActual.length === 0) {
    hasSettings();
    $("#dinamicPage").load("pages/welcome/page.html", function () {
      $.getScript("pages/welcome/script.js", function () {});
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
  document.body.style.backgroundImage = "url('assets/images/arabesque4.png')";
}

function changeTabColor(tabName) {
  let mainTabs = document.querySelectorAll(".tabActive");
  mainTabs.forEach( (tab) => {
    tab.classList.remove("tabActive");
    tab.classList.add("tabInactive")
  })
  const tab = document.getElementById(tabName);
  tab.classList.remove("tabInactive")
  tab.classList.add("tabActive")
}

// pageChange('#dinamicPage', 'components/projects/editProject.html', 'components/projects/script.js')