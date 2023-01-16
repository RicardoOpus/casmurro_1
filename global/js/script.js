function myLoadScript(url) {
  var js_script = document.createElement('script');
  js_script.type = "text/javascript";
  js_script.src = url;
  js_script.async = true;
  document.getElementsByTagName('head')[0].appendChild(js_script);
}

function pageChange(place, page, script) {
  $(place).load(page, function () {
    myLoadScript(script);
  });
}

function loadpage(pagename) {
  $("#dinamic").load("pages/" + pagename + "/page.html", function () {
    myLoadScript("pages/" + pagename + "/script.js");
  });
}


async function welcome() {
  const projectActual = await db.settings.toArray();
  if (projectActual.length === 0) {
    hasSettings();
    $("#dinamicPage").load("pages/welcome/page.html", function () {
      myLoadScript("pages/welcome/script.js");
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

function changeInnerTabColor(tabName) {
  let mainTabs = document.querySelectorAll(".innerTabActive");
  mainTabs.forEach( (tab) => {
    tab.classList.remove("innerTabActive");
    tab.classList.add("innerTabInactive")
  })
  const tab = document.getElementById(tabName);
  tab.classList.remove("innerTabInactive")
  tab.classList.add("innerTabActive")
}


function validateNewCard(inputTextId, idOkbtn) {
  const inputName = document.getElementById(inputTextId);
  inputName.addEventListener('input', () => {
    const inputValue = inputName.value
    if (!inputValue) {
      $( idOkbtn ).addClass( "ui-button-disabled ui-state-disabled" )
    } else {
      $( idOkbtn ).removeClass( "ui-button-disabled ui-state-disabled" )
    }
  });
}

async function getCurrentProjectID() {
  const projectActual = await db.settings.toArray();
  const idProject = projectActual[0].currentproject;
  return idProject;
} 

// pageChange('#dinamicPage', 'components/projects/editProject.html')
