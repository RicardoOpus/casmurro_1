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
};

async function getCurrentProjectID() {
  const projectActual = await db.settings.toArray();
  const idProject = projectActual[0].currentproject;
  return idProject;
};

async function setCurrentCard(card, id) {
  await db.settings.update(1, { currentCard: card, currendIdCard: id})
  return
};

// async function getCurrentCard() {
//   const cardActual = await db.settings.toArray();
//   const idProject = cardActual[0].currentCard;
//   return idProject;
// };

async function getCurrentCard() {
  const currentID = await getCurrentProjectID();
  const currentSettings = await db.settings.get(1);
  const currentCardID = await currentSettings.currendIdCard;
  const projectData = await db.projects.get(currentID);
  const positionInArray =  projectData.data.world.map(function (e) { return e.id; }).indexOf(currentCardID);
  return positionInArray;
};

async function deleteCard(cardType) {
  const currentID = await getCurrentProjectID();
  const currentCard = await getCurrentCard();

  db.projects.where('id').equals(currentID).modify( (e) => {
    e.data[cardType].splice(currentCard, 1)
  });
};

async function saveCardImage(typeCard, htmlPlace, pege, srcipt) {
  const currentID = await getCurrentProjectID();
  const currentCard = await getCurrentCard();
  const fileInput = document.querySelector('#my-image');
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result
    await db.projects.where('id').equals(currentID).modify( (e) => {
      e.data[typeCard][currentCard].image_card = base64String;
    });
  };
  reader.readAsDataURL(file);
  console.log('chegou aqui');
  return pageChange(htmlPlace, pege, srcipt)
};

async function deleteImageCard(typeCard, htmlPlace, pege, srcipt) {
  const currentID = await getCurrentProjectID();
  const currentCard = await getCurrentCard();
  await db.projects.where('id').equals(currentID).modify( (e) => {
    e.data[typeCard][currentCard].image_card = '';
  });
  return pageChange(htmlPlace, pege, srcipt)
};

function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight)+"px";
};

function resumeHeight() {
  const result = document.getElementById("content")
  result.style.height = result.scrollHeight+"px";
};

async function idManager(typeCard) {
  let result = '';
  const currentID = await getCurrentProjectID();
  const dataProject = await db.projects.get(currentID);
  result = await dataProject.id_world;
  await db.projects.where('id').equals(currentID).modify( (e) => {
    e[typeCard] = ++result;
  });
  return result
};

// pageChange('#dinamicPage', 'components/projects/editProject.html')
