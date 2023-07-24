/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
function myLoadScript(url) {
  const jsScript = document.createElement('script');
  jsScript.type = 'text/javascript';
  jsScript.src = url;
  jsScript.async = true;
  document.getElementsByTagName('head')[0].appendChild(jsScript);
}

function pageChange(place, page, script) {
  $(place).load(page, () => {
    myLoadScript(script);
  });
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

async function loadpage(pagename) {
  showLoading();
  try {
    const response = await fetch(`pages/${pagename}/page.html`);
    const html = await response.text();
    const dynamic = document.getElementById('dinamic');
    dynamic.innerHTML = html;
    const script = document.createElement('script');
    script.src = `pages/${pagename}/script.js`;
    dynamic.appendChild(script);
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
  hideLoading();
}

function loadpageDetail(detailPage) {
  pageChange('#dinamic', `components/${detailPage}/page.html`, `components/${detailPage}/script.js`);
}

async function loadpageOnclick(card, id, idCall, pagaCall, scriptCall) {
  showLoading();
  try {
    await db.settings.update(1, { currentCard: card, currendIdCard: id });
    pageChange(idCall, pagaCall, scriptCall);
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
  hideLoading();
}

async function welcome() {
  const projectActual = await db.settings.toArray();
  if (projectActual[0]?.currentproject === 0 || !projectActual.length) {
    $('#dinamicPage').load('pages/welcome/page.html', () => {
      hasSettings();
      myLoadScript('pages/welcome/script.js');
    });
  } else {
    pageChange('#dinamicPage', 'pages/dashboard/page.html', 'pages/dashboard/script.js');
  }
}

function changeStatusColor() {
  const statusHtml = document.querySelectorAll('.projectStatus');
  statusHtml.forEach((elem) => {
    const classStatus = elem.innerText;
    const n = classStatus.split(' ').pop();
    elem.classList.add(n);
  });
}

$(document).ready(() => {
  welcome();
});

function convertToTime(date) {
  const result = `${date.getHours()}h${date.getMinutes()}`;
  return result;
}

function convertDateBR(date) {
  if (date instanceof Date) {
    const result = date.toLocaleDateString('pt-br');
    return result;
  }
  return null;
}

function convertDateUS(dateUS) {
  const date = dateUS;
  const [day, month, year] = date.split('/');
  const dateBR = [year, month, day].join('-');
  return dateBR;
}

function convertDatePTBR(dateUS) {
  let dateBR = '';
  if (dateUS) {
    const date = dateUS;
    const [year, month, day] = date.split('-');
    dateBR = [day, month, year].join('/');
  }
  return dateBR;
}

function restoreBackground() {
  document.body.style.backgroundImage = "url('assets/images/arabesque4.png')";
}

function changeTabColor(tabName) {
  const mainTabs = document.querySelectorAll('.tabActive');
  mainTabs.forEach((tab) => {
    tab.classList.remove('tabActive');
    tab.classList.add('tabInactive');
  });
  const tab = document.getElementById(tabName);
  tab.classList.remove('tabInactive');
  tab.classList.add('tabActive');
}

function changeInnerTabColor(tabID) {
  const mainTabs = document.querySelectorAll('.innerTabActive');
  mainTabs.forEach((tab) => {
    tab.classList.remove('innerTabActive');
    tab.classList.add('innerTabInactive');
  });
  const tab = document.getElementById(tabID);
  tab.classList.remove('innerTabInactive');
  tab.classList.add('innerTabActive');
}

function validateNewCard(inputTextId, idOkbtn) {
  const inputName = document.getElementById(inputTextId);
  inputName.addEventListener('input', () => {
    const inputValue = inputName.value;
    if (!inputValue) {
      $(idOkbtn).addClass('ui-button-disabled ui-state-disabled');
    } else {
      $(idOkbtn).removeClass('ui-button-disabled ui-state-disabled');
    }
  });
}

// ================= project ============================

async function getCurrentProjectID() {
  const projectActual = await db.settings.toArray();
  const idProject = projectActual[0].currentproject;
  return idProject;
}

async function getCurrentProject() {
  const currentID = await getCurrentProjectID();
  const project = await db.projects.get(currentID);
  return project;
}

async function setCurrentCard(card, id) {
  await db.settings.update(1, { currentCard: card, currendIdCard: id });
}

async function updateLastEdit(projectID) {
  const now = new Date();
  return db.projects.where('id').equals(projectID).modify({ last_edit: now });
}

async function getCurrentScene(idParam) {
  const currentID = await getCurrentProjectID();
  const projectData = await db.projects.get(currentID);
  const positionInArray = projectData.data.scenes.map((e) => e.id).indexOf(idParam);
  return positionInArray;
}

async function getStructureByID(table, idParam) {
  const currentID = await getCurrentProjectID();
  const projectData = await db.projects.get(currentID);
  const positionInArray = projectData.data[table].map((e) => e.id).indexOf(idParam);
  return positionInArray;
}

async function getCurrentCard() {
  const currentID = await getCurrentProjectID();
  const currentSettings = await db.settings.get(1);
  const currentCardID = await currentSettings.currendIdCard;
  const currentCardName = await currentSettings.currentCard;
  const projectData = await db.projects.get(currentID);
  const positionInArray = projectData.data[currentCardName].map((e) => e.id).indexOf(currentCardID);
  return positionInArray;
}

async function getCurrentCardID() {
  const currentSettings = await db.settings.get(1);
  const currentCardID = await currentSettings.currendIdCard;
  return currentCardID;
}

async function deleteLastEditCards(table, id) {
  const project = await getCurrentProject();
  const projectID = await getCurrentProjectID();
  const index = project.recent_edits.findIndex((item) => item.id === id && item.table === table);
  return db.projects.where('id').equals(projectID).modify((e) => {
    e.recent_edits.splice(index, 1);
  });
}

async function deleteCard(cardType) {
  const currentID = await getCurrentProjectID();
  const currentCard = await getCurrentCard();
  const currentCardID = await getCurrentCardID();
  await deleteLastEditCards(cardType, currentCardID);
  db.projects.where('id').equals(currentID).modify((e) => {
    e.data[cardType].splice(currentCard, 1);
  });
}

function resizeImage(imageData) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const newWidth = 200;
      const newHeight = 200;
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const resizedImageData = canvas.toDataURL();
      resolve(resizedImageData);
    };
    img.onerror = () => {
      reject(new Error('Erro ao carregar a imagem.'));
    };
    img.src = imageData;
  });
}

async function saveCardImage(typeCard, htmlPlace, page, srcipt) {
  const currentID = await getCurrentProjectID();
  const currentCard = await getCurrentCard();
  const fileInput = document.querySelector('#my-image');
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result;
    const resizedImageData = await resizeImage(base64String);
    await db.projects.where('id').equals(currentID).modify((e) => {
      e.data[typeCard][currentCard].image_card_mini = resizedImageData;
    });
    await db.projects.where('id').equals(currentID).modify((e) => {
      e.data[typeCard][currentCard].image_card = base64String;
      return pageChange(htmlPlace, page, srcipt);
    });
  };
  reader.readAsDataURL(file);
}

async function deleteImageCard(typeCard, htmlPlace, page, srcipt) {
  const currentID = await getCurrentProjectID();
  const currentCard = await getCurrentCard();
  await db.projects.where('id').equals(currentID).modify((e) => {
    e.data[typeCard][currentCard].image_card_mini = '';
  });
  await db.projects.where('id').equals(currentID).modify((e) => {
    e.data[typeCard][currentCard].image_card = '';
  });
  return pageChange(htmlPlace, page, srcipt);
}

function substituirHifens(input) {
  if (input) {
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    // eslint-disable-next-line no-param-reassign
    input.value = input.value.replace(/--/g, '—');
    input.setSelectionRange(startPos, endPos);
  }
}

function autoGrow(element) {
  // eslint-disable-next-line no-param-reassign
  element.style.height = '0px';
  // eslint-disable-next-line no-param-reassign
  element.style.height = `${element.scrollHeight}px`;
}

function resumeHeight(...args) {
  const results = args.map((arg) => document.getElementById(arg));
  results.forEach((result) => {
    if (result) {
      // eslint-disable-next-line no-param-reassign
      result.style.height = `${result.scrollHeight}px`;
    }
  });
}

function setContentOpacity() {
  const content = document.querySelectorAll('.it');
  content.forEach((cont) => {
    if (cont.clientHeight > 149) {
      cont.classList.add('worldContent');
    }
  });
}

function setImageOpacity() {
  const content = document.querySelectorAll('.worldListImage');
  content.forEach((cont) => {
    if (cont.clientHeight > 149) {
      cont.classList.add('worldListImageOpacity');
    }
  });
}

async function idManager(typeCard) {
  const currentID = await getCurrentProjectID();
  const dataProject = await db.projects.get(currentID);
  const actual = dataProject[typeCard];
  const result = actual + 1;
  await db.projects.update(currentID, { [typeCard]: result });
  return result;
}

async function verifyCat(type, category) {
  const projectID = await getCurrentProjectID();
  const projectData = await db.projects.get(projectID);
  const categoryList = await projectData.settings[type];
  return categoryList.includes(category);
}

async function addNewCategory(type, category) {
  const verify = await verifyCat(type, category);
  if (verify) {
    return alert('Item já foi adicionado!');
  }
  const projectID = await getCurrentProjectID();
  return db.projects.where('id').equals(projectID).modify((e) => {
    e.settings[type].push(category);
  });
}

async function removeCategory(type, category) {
  const projectID = await getCurrentProjectID();
  const projectData = await db.projects.get(projectID);
  const positionInArray = projectData.settings[type].indexOf(category);
  db.projects.where('id').equals(projectID).modify((e) => {
    e.settings[type].splice(positionInArray, 1);
  });
}

function sortByKey(array, key) {
  return array.sort((a, b) => {
    const x = a[key]; const y = b[key];
    if (x < y) {
      return -1;
    } if (x > y) {
      return 1;
    }
    return 0;
  });
}

function sortByDate(array) {
  return array.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
}

async function setCustomTabs(type) {
  $('.sideBar').empty();
  $('.sideBar').append($('<h3>Categorías</h3><div class="divider"></div><button class="innerTabActive target" onclick="setFilterCategory(\'All\', \'All\')" id="Todos">Todos</button>'));
  if (type === 'notes') {
    $('.sideBar').append($('<button class="innerTabInactive target" onclick="setFilterCategory(\'Listas\', \'Listas\')" id="Listas">Listas</button>'));
  }
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --' || value === '-- nenhum --') {
      return null;
    }
    const qty = project?.data?.[type]?.filter((ele) => ele.category === value);
    return $('.sideBar').append($(`<button class='innerTabInactive target' onclick="setFilterCategory('${value}', '${value}')" id='${value}'></button>`).html(`${value} (${qty.length})`));
  });
}

function povFilterLoadPage(id) {
  localStorage.setItem('idPovFilter', id);
  pageChange('#dinamic', 'components/filtredPovScene/page.html', 'components/filtredPovScene/script.js');
}

function chapterFilterLoadPage(id) {
  localStorage.setItem('chapterFilter', id);
  localStorage.setItem('ScenesLastTab', 'CHAPTER');
  pageChange('#dinamic', 'components/filtredPovScene/page.html', 'components/filtredPovScene/script_chapter.js');
}

async function setCustomPovTabs(type, callback) {
  $('.sideBar').empty();
  $('.sideBar').append($('<h3>Categorías</h3><div class="divider"></div><button class="innerTabActive target" onclick="setFilterCategory(\'All\', \'All\')" id="Todos">Todos</button>'));
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --' || value === '-- nenhum --') {
      return null;
    }
    const povID = project.data.characters.map((e) => e.id).indexOf(Number(value));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    const qty = project?.data?.scenes?.filter((ele) => ele.pov_id === value);
    return $('.sideBar').append($(`<button id='${value}' class='innerTabInactive target' onclick="ocultarElementosPOV('${value}')"'></button>`).html(`${povName} (${qty.length})`));
  });
  $('.sideBar').append($('<div class="innerTabChapters"></div>'));
  if (callback) {
    callback(); // chama a função de callback, se fornecida
  }
}

async function setStructureTabs(tab) {
  $('.sideBar').empty();
  $('.sideBar').append($(`<h3>Esboço</h3><div class="divider"></div>
    <button class="${tab === 'outline' ? 'innerTabActive' : 'innerTabInactive'} target" onclick="setLastTabStructure('OUTLINE')" id="subplotsTab">Rascunho</button>
    <button class="${tab === 'chap' ? 'innerTabActive' : 'innerTabInactive'} target" onclick="setLastTabStructure('CHAPTER')" id="chaptersTab">Capítulos</button>
    <button class="${tab === 'part' ? 'innerTabActive' : 'innerTabInactive'} target" onclick="setLastTabStructure('PART')" id="partsTab">Partes</button>
  `));
}

async function setCustomTimelineTabs(type, callback) {
  $('.sideBar').empty();
  $('.sideBar').append($('<h3>Personagem</h3><div class="divider"></div><button class="innerTabActive target" onclick="setFilterCategory(\'All\', \'All\')" id="Todos">Todos</button>'));
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --' || value === '-- nenhum --') {
      return null;
    }
    const povID = project.data.characters.map((e) => e.id).indexOf(Number(value));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    const qty = project?.data?.[type]
      ?.filter((ele) => ele.elementID === Number(value) || ele.pov_id === value);
    return $('.sideBar').append($(`<button id='${value}' data-testid='tab${value}' class='innerTabInactive target' onclick="setFilterCategory('tab${value}', '${value}')"'></button>`).html(`${povName} (${qty.length})`));
  });
  if (callback) {
    callback(); // chama a função de callback, se fornecida
  }
}

async function restoreDelCategories(type, id) {
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $(id).empty();
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --') {
      return $(id).append($('<option disabeld></option>').val('').html(value));
    } if (value === 'Fato histórico' || value === '-- nenhum --') {
      return null;
    }
    return $(id).append($('<option></option>').val(value).html(value));
  });
}

async function restoreDelPovTab(type, id) {
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $(id).empty();
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --') {
      return $(id).append($('<option disabeld></option>').val('').html(value));
    } if (value === 'Fato histórico' || value === '-- nenhum --') {
      return null;
    }
    const povID = project.data.characters.map((e) => e.id).indexOf(Number(value));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    return $(id).append($('<option></option>').val(value).html(povName));
  });
}

async function restorePOV(id, type) {
  const project = await getCurrentProject();
  const itensList = project.data[type];
  $(id).empty();
  $(id).append($('<option disabeld></option>').val('').html('-- selecione --'));
  $.each(itensList, (i, value) => $(id).append($('<option></option>').val(value.id).html(value.title)));
}

async function restorePlace(id, type) {
  const project = await getCurrentProject();
  const itensList = project.data[type];
  $(id).empty();
  $(id).append($('<option disabeld></option>').val('').html('-- selecione --'));
  // eslint-disable-next-line consistent-return
  $.each(itensList, (i, value) => {
    if (value.category === 'Local') {
      return $(id).append($('<option></option>').val(value.id).html(value.title));
    }
  });
}

async function restoreTimelineDates(id) {
  $(id).empty();
  $(id).append($('<option disabeld></option>').val('').html('-- selecione --'));
  getTimelineSimle(id);
}

async function applyCharScene(id, idChars) {
  const project = await getCurrentProject();
  $(id).empty();
  $(id).append($('<h3 >Personagens em cena:<div id="charsInnerDiv" class="characters_scene_list"></div></h3>'));
  $.each(idChars, (i, value) => {
    const pov = project.data.characters.map((e) => e.id).indexOf(Number(value));
    const povName = project?.data?.characters?.[pov]?.title ?? '';
    const povColor = project?.data?.characters?.[pov]?.color ?? '';
    const povID = project?.data?.characters?.[pov]?.id ?? '';
    const povImg = project?.data?.characters?.[pov]?.image_card ?? '';
    return $('#charsInnerDiv').append($(`<div class='elementCharScene'><img src='${povImg || 'assets/images/person.png'}' class='imgCharScene'></img><p onclick="loadpageOnclick('characters', ${povID}, '#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js')" style='margin: 5px; color: black; background-color: ${povColor}; border-radius: 5px; padding: 5px; cursor: pointer'> ${povName}</p></div>`));
  });
}

async function restoreCharScene(id, type) {
  const currentCardID = await getCurrentCardID();
  const project = await getCurrentProject();
  let chklist = '';
  project.data.scenes.forEach((ele) => {
    if (ele.id === currentCardID) {
      chklist = ele.scene_characters;
    }
  });
  const itensList = project.data[type];
  $(id).empty();
  $.each(itensList, (i, value) => {
    const checkbox = $(`<input id='${value.id}' type='checkbox'><label for='${value.id}'></label><br>`).val(value.id).html(value.title);
    if (chklist?.includes(Number(value.id))) {
      checkbox.prop('checked', true);
    }
    $(id).append(checkbox);
  });
}

async function restoreScenesListInput(id) {
  const currentCardID = await getCurrentCardID();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.scenes, 'position');
  const allchapters = project.data.chapters;
  const filtredChaptes = allchapters.filter((chapter) => chapter.id !== currentCardID);
  let chklist = '';
  project.data.chapters.forEach((ele) => {
    if (ele.id === currentCardID) {
      chklist = ele.scenes;
    }
  });
  const itensList = resultSorted;
  $(id).empty();
  $.each(itensList, (i, value) => {
    const isScenePresent = filtredChaptes.some((chapter) => chapter?.scenes?.includes(value.id));
    if (isScenePresent) {
      const checkbox = $('<input type=\'checkbox\' disabled></input><label style=\'text-decoration: line-through\'></label><br>').html(value.title);
      $(id).append(checkbox);
    } else {
      const checkbox = $(`<input id='cena-${value.id}' type='checkbox' name='${value.position}'></input><label style='color: white' for='cena-${value.id}'></label><br>`).val(value.id).html(value.title);
      if (chklist?.includes(Number(value.id))) {
        checkbox.prop('checked', true);
      }
      $(id).append(checkbox);
    }
  });
}

// juntar com a de cima
async function restoreChapListInput(id) {
  const currentCardID = await getCurrentCardID();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.chapters, 'position');
  const allParts = project.data.parts;
  const filtredParts = allParts.filter((part) => part.id !== currentCardID);
  let chklist = '';
  project.data.parts.forEach((ele) => {
    if (ele.id === currentCardID) {
      chklist = ele.chapters;
    }
  });
  const itensList = resultSorted;
  $(id).empty();
  $.each(itensList, (i, value) => {
    const isChapterPresent = filtredParts.some((part) => part?.chapters?.includes(value.id));
    if (isChapterPresent) {
      const checkbox = $('<input type=\'checkbox\' disabled></input><label style=\'text-decoration: line-through\'></label><br>').html(value.title);
      $(id).append(checkbox);
    } else {
      const checkbox = $(`<input id='chapter-${value.id}' type='checkbox' name='${value.position}'  style='color: white'></input><label for='chapter-${value.id}'></label><br>`).val(value.id).html(value.title);
      if (chklist?.includes(Number(value.id))) {
        checkbox.prop('checked', true);
      }
      $(id).append(checkbox);
    }
  });
}

function calculateTimeElapsed(date1, date2) {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  const timeElapsed = Math.abs(date2Obj.getTime() - date1Obj.getTime());

  const yearInMs = 1000 * 60 * 60 * 24 * 365;
  const monthInMs = 1000 * 60 * 60 * 24 * 30;
  const dayInMs = 1000 * 60 * 60 * 24;

  const yearsElapsed = Math.floor(timeElapsed / yearInMs);
  const monthsElapsed = Math.floor((timeElapsed % yearInMs) / monthInMs);
  const daysElapsed = Math.floor(((timeElapsed % yearInMs) % monthInMs) / dayInMs);

  return {
    years: yearsElapsed,
    months: monthsElapsed,
    days: daysElapsed,
  };
}

async function restoreCategories(type) {
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $('#category').empty();
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --') {
      return $('#category').append($('<option disabled></option>').val('').html(value));
    } if (value === '-- nenhum --') {
      return $('#category').append($('<option></option>').val('').html(value));
    }
    return $('#category').append($('<option></option>').val(value).html(value));
  });
}

async function restoreGenders() {
  const project = await getCurrentProject();
  const gendersList = project.settings.genders;
  $('#gender').empty();
  $.each(gendersList, (i, value) => {
    if (value === '-- selecione --') {
      return $('#gender').append($('<option disabled></option>').val('').html(value));
    }
    return $('#gender').append($('<option></option>').val(value).html(value));
  });
}

async function randomColor() {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  const place = document.getElementById('color');
  const colorNow = `#${color}`;
  place.value = colorNow;

  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  return db.projects.where('id').equals(currentID).modify((e) => {
    e.data.characters[positionInArray].color = colorNow;
  });
}

async function NewTimelineCharacter(date, idCharcter, type) {
  const typeDate = type === 'characters-birth' ? 'characters-birth' : 'characters-death';
  const ID = await idManager('id_timeline');
  const pjID = await getCurrentProjectID();
  let result = '';
  const data = {
    title: '',
    elementType: typeDate,
    elementID: idCharcter,
    content: '',
    date,
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.timeline.push(data);
  }).then(() => {
    result = data.id;
  });
  return result;
}

async function NewTimelineGeneric(date, idCharcter, type) {
  const ID = await idManager('id_timeline');
  const pjID = await getCurrentProjectID();
  let result = '';
  const data = {
    title: '',
    elementType: type,
    elementID: idCharcter,
    historicID: '',
    sceneID: '',
    content: '',
    date,
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.timeline.push(data);
  }).then(() => {
    result = data.id;
  });
  return result;
}

async function NewTimelineGenericWorld(date, historicID, type) {
  const ID = await idManager('id_timeline');
  const pjID = await getCurrentProjectID();
  let result = '';
  const data = {
    title: '',
    elementType: type,
    elementID: '',
    historicID,
    sceneID: '',
    content: '',
    date,
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.timeline.push(data);
  }).then(() => {
    result = data.id;
  });
  return result;
}

async function NewTimelineGenericScene(date, sceneID, type) {
  const ID = await idManager('id_timeline');
  const pjID = await getCurrentProjectID();
  let result = '';
  const data = {
    title: '',
    elementType: type,
    elementID: '',
    historicID: '',
    sceneID,
    content: '',
    date,
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.timeline.push(data);
  }).then(() => {
    result = data.id;
  });
  return result;
}

async function checkTimelineNewDate(elementID, typeDate, type) {
  const projectData = await getCurrentProject();
  const resultado = projectData.data.timeline
    .filter((item) => item.elementType === typeDate && item[type] === elementID);
  return resultado.length > 0;
}

async function clearDate(type) {
  document.getElementById('date').value = '';
  const projectData = await getCurrentProject();
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  const idTimeline = projectData.data[type][positionInArray].date;
  const positionInArrayTime = projectData.data.timeline.map((e) => e.id).indexOf(idTimeline);
  if (positionInArrayTime !== -1) {
    await db.projects.where('id').equals(currentID).modify((e) => {
      e.data.timeline.splice(positionInArrayTime, 1);
    });
  }
  return db.projects.where('id').equals(currentID).modify((e) => {
    e.data[type][positionInArray].date = '';
  });
}

function getChapterName(chapters, id) {
  if (chapters) {
    for (let i = 0; i < chapters.length; i += 1) {
      const elem = chapters[i];
      if (elem && elem.scenes && elem.scenes.includes(id)) {
        return elem.title;
      }
    }
  }
  return null;
}

async function updateLastEditList(table, id) {
  const project = await getCurrentProject();
  const projectID = await getCurrentProjectID();
  const numbersOfRecents = 10;
  const result = { table, id };
  const recentEdits = project.recent_edits.filter(
    (item) => item.table !== table || item.id !== id,
  );
  if (recentEdits.length < numbersOfRecents) {
    return db.projects.where('id').equals(projectID).modify((e) => {
      e.recent_edits = [...recentEdits, result];
    });
  }
  return db.projects.where('id').equals(projectID).modify((e) => {
    e.recent_edits = [...recentEdits.slice(1), result];
  });
}

async function lastEditListModify(table, id) {
  const project = await getCurrentProject();
  const projectID = await getCurrentProjectID();
  const result = { table, id };
  const verify = project.recent_edits.some((item) => item.id === id && item.table === table);
  if (verify) {
    const index = project.recent_edits.findIndex((item) => item.id === id && item.table === table);
    return db.projects.where('id').equals(projectID).modify((e) => {
      e.recent_edits.splice(index, 1);
      e.recent_edits.push(result);
    });
  }
  return db.projects.where('id').equals(projectID).modify((e) => {
    e.recent_edits.splice(0, 1);
    e.recent_edits.push(result);
  });
}

async function previousAndNextCard(tableArray, tableName, detailName) {
  const positionInArray = await getCurrentCard();
  const nextDiv = document.getElementById('NextDiv');
  const prevDiv = document.getElementById('PreviousDiv');
  const next = tableArray[positionInArray + 1];
  const prev = tableArray[positionInArray - 1];
  if (prev) {
    prevDiv.innerHTML = `<p onclick="loadpageOnclick('${tableName}', ${prev.id}, '#dinamic', 'components/${detailName}/page.html', 'components/${detailName}/script.js')">${prev.title}</p>`;
  }
  if (next) {
    nextDiv.innerHTML = `<p onclick="loadpageOnclick('${tableName}', ${next.id}, '#dinamic', 'components/${detailName}/page.html', 'components/${detailName}/script.js')">${next.title}</p>`;
  }
}

async function previousNextPosition(tableArray, tableName, detailName) {
  const resultSorted = sortByKey(tableArray, 'position');
  const currentSettings = await db.settings.get(1);
  const currentCardID = await currentSettings.currendIdCard;
  const positionInArray = resultSorted.map((e) => e.id).indexOf(currentCardID);
  const nextDiv = document.getElementById('NextDiv');
  const prevDiv = document.getElementById('PreviousDiv');
  const next = tableArray[positionInArray + 1];
  const prev = tableArray[positionInArray - 1];
  if (prev) {
    prevDiv.innerHTML = `<p onclick="loadpageOnclick('${tableName}', ${prev.id}, '#dinamic', 'components/${detailName}/page.html', 'components/${detailName}/script.js')">${prev.title}</p>`;
  }
  if (next) {
    nextDiv.innerHTML = `<p onclick="loadpageOnclick('${tableName}', ${next.id}, '#dinamic', 'components/${detailName}/page.html', 'components/${detailName}/script.js')">${next.title}</p>`;
  }
}

async function saveSorted(pjID, table) {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data[table], 'title');
  db.projects.where('id').equals(pjID).modify((ele) => {
    // eslint-disable-next-line no-param-reassign
    ele.data[table] = resultSorted;
  });
}

function clearList() {
  const projectList = document.getElementById('project-list');
  const { children } = projectList;
  for (let i = children.length - 1; i >= 0; i -= 1) {
    const child = children[i];
    if (child.tagName.toLowerCase() !== 'button') {
      projectList.removeChild(child);
    }
  }
}

function sortByAZ(page, type, callback) {
  localStorage.setItem(page, type);
  clearList();
  callback();
}

async function recovLastTab(table, tableName, callbackGetFiltred, callbackGetAll) {
  await setCustomTabs(table);
  const savedTab = localStorage.getItem(tableName);
  const tab = document.getElementById(savedTab);
  if (tab) {
    callbackGetFiltred(tab.id);
    changeInnerTabColor(tab.id);
  } else {
    callbackGetAll();
  }
}

function putTabsAmount(data) {
  const tabChap = document.getElementById('chaptersTab');
  const tabPart = document.getElementById('partsTab');
  const qtyChap = data.chapters.length;
  const qtyPart = data.parts.length;
  tabChap.innerText = `Capítulos (${qtyChap})`;
  tabPart.innerText = `Partes (${qtyPart})`;
}

function putTabAllAmount(data) {
  const tabAll = document.getElementById('Todos');
  if (tabAll.innerText === 'Todos') {
    const qtyAll = data.length;
    tabAll.innerText += ` (${qtyAll})`;
  }
}

function putTabListAmount(project) {
  const tabList = document.getElementById('Listas');
  if (tabList.innerText === 'Listas') {
    const qty = project?.filter((ele) => ele.category === 'Listas');
    tabList.innerText += ` (${qty.length})`;
  }
}

function putTabAllScenesAmount(project) {
  const tabList = document.getElementById('Todos');
  if (tabList.innerText === 'Todos') {
    tabList.innerText += ` (${project.length})`;
  }
}

function colocarItalico() {
  const textoOriginal = document.getElementById('content_full').innerHTML;
  const regex = /\*([^*]+)\*/g;
  const resultado = textoOriginal.replace(regex, '<i><span class="invisibleChar">*</span>$1<span class="invisibleChar">*</span></i>');
  document.getElementById('content_full').innerHTML = resultado;
}

function contarPalavras(conteudoTexto) {
  const textoLimpo = conteudoTexto.trim().replace(/\s+/g, ' ');
  const palavras = textoLimpo.split(' ');
  if (palavras[0] === '') {
    document.getElementById('wcQty').innerHTML = '0 ';
    document.getElementById('wordCount').innerHTML = '0 ';
  } else {
    document.getElementById('wcQty').innerHTML = `${palavras.length} `;
    document.getElementById('wordCount').innerHTML = `${palavras.length} `;
  }
  return palavras.length;
}

function replaceDiv() {
  const contentElement = document.querySelector('.sceneViewer');
  const contentDiv = document.getElementById('writingViwer');
  const elementEdit = document.querySelector('.hwt-container');
  if (elementEdit) {
    contentDiv.removeChild(elementEdit);
    contentDiv.appendChild(contentElement);
  }
}

function salvarDeclaracaoCSS() {
  const elemento = document.querySelector('.hwt-container');
  const declaracaoCSS = elemento.getAttribute('style');
  localStorage.setItem('declaracaoCSS', declaracaoCSS);
}

function salvarDimensoes(elemento) {
  const declaracaoCSS = elemento.getAttribute('style');
  localStorage.setItem('dimensoes', declaracaoCSS);
}

function resgatarDeclaracaoCSS() {
  const elemento = document.querySelector('.hwt-container');
  const declaracaoCSS = localStorage.getItem('declaracaoCSS');
  if (declaracaoCSS) {
    elemento.setAttribute('style', declaracaoCSS);
  }
}

function setFullViewerScene() {
  const declaracaoCSS = localStorage.getItem('dimensoes');
  const writingViwer = document.getElementById('writingViwer');
  writingViwer.classList = 'writingViwer';
  const textArera = document.getElementById('content_full');
  if (!declaracaoCSS) {
    const altura = window.innerHeight;
    const largura = window.innerWidth;
    textArera.style.height = `${altura * 0.8}px`;
    textArera.style.width = `${largura * 0.7}px`;
  } else {
    textArera.setAttribute('style', declaracaoCSS);
  }
  document.getElementById('main-header').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
  window.scrollTo({ top: 0 });
}

function resetFullViewerScene() {
  document.getElementById('main-header').style.display = 'block';
  document.querySelector('footer').style.display = 'block';
  document.getElementById('elementTimmer').style.display = 'none';
  const writingViwer = document.getElementById('writingViwer');
  writingViwer.classList = '';
}

function exibirFimdoTempo() {
  const wordsOld = localStorage.getItem('wordsSession');
  const wordsActual = document.getElementById('wordCount');
  console.log(wordsActual.innerText, wordsOld);
  const elemento = document.createElement('p');
  document.getElementById('elementTimmer').innerText = `${Number(wordsActual.innerText) - wordsOld} palavras`;
  elemento.innerHTML = 'Fim do tempo!';
  elemento.classList = 'goalWarning';
  document.body.appendChild(elemento);
  setTimeout(() => {
    document.body.removeChild(elemento);
  }, 5000);
}

let intervalo;

function contagemRegressiva(minutos) {
  const words = document.getElementById('wordCount');
  localStorage.setItem('wordsSession', words.innerText);
  let segundos = minutos * 60;
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    const minutosRestantes = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    const elementTimmer = document.getElementById('elementTimmer');

    minutosRestantesFormatado = minutosRestantes.toString().padStart(2, '0');
    segundosRestantesFormatado = segundosRestantes.toString().padStart(2, '0');
    elementTimmer.innerText = `${minutosRestantesFormatado}:${segundosRestantesFormatado}`;
    if (segundos > 0) {
      segundos -= 1;
    } else {
      clearInterval(intervalo);
      exibirFimdoTempo();
    }
  }, 1000);
}

function startTimmer() {
  const modal = document.getElementById('myModalTimmer');
  document.getElementById('elementTimmer').style.display = 'block';
  const minutes = document.getElementById('minutes').value;
  modal.style.display = 'none';
  contagemRegressiva(minutes);
}

function transformSceneToViewer() {
  resetFullViewerScene();
  clearInterval(intervalo);
  document.getElementById('doneBtn').disabled = true;
  document.getElementById('doneBtn').classList = 'ui-button ui-corner-all disabledBtn';
  document.getElementById('editBtn').disabled = false;
  document.getElementById('editBtn').classList = 'ui-button ui-corner-all';
  document.getElementById('WriteButtons').style.display = 'none';
  document.getElementById('contValues').style.display = 'none';
  document.getElementById('topButton').setAttribute('onclick', 'topFunction()');
  const textarea = document.getElementById('content_full');
  contarPalavras(textarea.value);
  const div = document.createElement('div');
  div.className = 'sceneViewer';
  const paragraphs = textarea.value.split('\n'); // Separa o texto em parágrafos usando a quebra de linha como delimitador

  for (let i = 0; i < paragraphs.length; i += 1) {
    const paragraph = document.createElement('p');
    if (i === 0) {
      paragraph.classList = 'fristParagraph';
    } if (i > 0) {
      paragraph.classList = 'sceneViewerP';
    }
    paragraph.innerText = paragraphs[i];
    div.appendChild(paragraph);
  }

  div.id = 'content_full';
  textarea.parentNode.replaceChild(div, textarea);
  replaceDiv();
  colocarItalico();
}

function clearMark() {
  const highlighter = new HighlightWithinTextarea(document.querySelector('.highlight'), {
    highlight: '',
  });
}

function markQuotation() {
  const highlighter = new HighlightWithinTextarea(document.querySelector('.highlight'), {
    highlight: /(['"])(.*?)\1/g,
    className: 'green',
  });
}

function markEmDash() {
  const highlighter = new HighlightWithinTextarea(document.querySelector('.highlight'), {
    highlight: /—(.+?)(?=(\n|$))/gs,
    className: 'green',
  });
}

function markItalics() {
  const highlighter = new HighlightWithinTextarea(document.querySelector('.highlight'), {
    highlight: /\*(.*?)\*/g,
    className: 'green',
  });
}

function markComments() {
  const highlighter = new HighlightWithinTextarea(document.querySelector('.highlight'), {
    highlight: /\[(.*?)\]/g,
    className: 'green',
  });
}

async function knowItens(itensList) {
  const highlighter = new HighlightWithinTextarea(document.querySelector('.highlight'), {
    highlight: itensList,
    className: 'green',
  });
}

async function markKnowItens(table) {
  const projectData = await getCurrentProject();
  const itensList = projectData.data[table].map((item) => item.title);
  knowItens(itensList);
}

function setmark(value) {
  switch (value) {
    case 'markQuotation()':
      markQuotation();
      break;
    case 'markEmDash()':
      markEmDash();
      break;
    case 'markItalics()':
      markItalics();
      break;
    case 'markComments()':
      markComments();
      break;
    case "markKnowItens('characters')":
      markKnowItens('characters');
      break;
    case "markKnowItens('world')":
      markKnowItens('world');
      break;
    case 'clearMark()':
      clearMark();
      break;
    default:
      break;
  }
}

function exibirMetaBatida() {
  const elemento = document.createElement('p');
  elemento.innerHTML = "<span style='color: green'>🗸</span> Meta batida!";
  elemento.classList = 'goalWarning';
  document.body.appendChild(elemento);
  setTimeout(() => {
    document.body.removeChild(elemento);
  }, 5000);
}

function updateWC() {
  const contentElement = document.getElementById('content_full');
  const wordCountElement = document.getElementById('wordCount');
  const goalElement = document.getElementById('goalWC');
  const progressElement = document.getElementById('progress');

  function countWords(text) {
    const words = text.trim().split(/\s+/);
    return words.length;
  }

  function updateWordCount() {
    const content = contentElement.value;
    const wordCount = countWords(content);
    const goal = Number(goalElement.value);
    wordCountElement.innerText = wordCount;
    if (goal !== 0) {
      const percentage = Math.floor((wordCount / goal) * 100);
      progressElement.innerText = `- ${percentage}%`;
      if (wordCount === goal) {
        exibirMetaBatida();
      }
    }
  }
  contentElement.addEventListener('input', updateWordCount);
}

function tabInsideContentFull(element) {
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      element.scrollBy(0, 40);
    }
    if (e.ctrlKey) {
      e.preventDefault();
      element.scrollBy(0, -40);
    }
  });
}

function writeScene() {
  document.getElementById('doneBtn').disabled = false;
  document.getElementById('doneBtn').classList = 'ui-button ui-corner-all';
  document.getElementById('editBtn').disabled = true;
  document.getElementById('editBtn').classList = 'ui-button ui-corner-all disabledBtn';
  document.getElementById('WriteButtons').style.display = 'block';
  document.getElementById('contValues').style.display = 'block';
  const div = document.getElementById('content_full');
  const paragraphs = div.getElementsByTagName('p');
  let text = '';
  for (let i = 0; i < paragraphs.length; i += 1) {
    text += `${paragraphs[i].innerText}\n`;
  }
  contarPalavras(text);
  const textarea = document.createElement('textarea');
  textarea.id = 'content_full';
  textarea.classList = 'highlight projectInputForm focusMode';
  textarea.setAttribute('type', 'textarea');
  textarea.setAttribute('rows', '8');
  textarea.setAttribute('oninput', 'substituirHifens(this)');
  textarea.value = text;
  div.parentNode.replaceChild(textarea, div);
  clearMark();
  resgatarDeclaracaoCSS();
  saveDataScene();
  updateWC();
  setFullViewerScene();
  tabInsideContentFull(textarea);
}

function toggleFullscreen() {
  if (
    document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

function aumentarFonte() {
  const element = document.querySelector('.hwt-container');
  const { fontSize } = window.getComputedStyle(element);
  const currentSize = parseFloat(fontSize);
  const newSize = currentSize + 2;
  element.style.fontSize = `${newSize}px`;
  salvarDeclaracaoCSS();
}

function diminuirFonte() {
  const element = document.querySelector('.hwt-container');
  const { fontSize } = window.getComputedStyle(element);
  const currentSize = parseFloat(fontSize);
  const newSize = currentSize - 2;
  element.style.fontSize = `${newSize}px`;
  salvarDeclaracaoCSS();
}

function modificarLargura(type) {
  const element = document.getElementById('content_full');
  const { width } = window.getComputedStyle(element);
  const currentSize = parseFloat(width);
  let newSize = 0;
  if (type === 'sum') {
    newSize = currentSize + 20;
  } else {
    newSize = currentSize - 20;
  }
  element.style.width = `${newSize}px`;
  salvarDimensoes(element);
}

function modificarAltura(type) {
  const element = document.getElementById('content_full');
  const { height } = window.getComputedStyle(element);
  const currentSize = parseFloat(height);
  let newSize = 0;
  if (type === 'sum') {
    newSize = currentSize + 20;
  } else {
    newSize = currentSize - 20;
  }
  element.style.height = `${newSize}px`;
  salvarDimensoes(element);
}

function changeFontFamily(fontFamily) {
  document.querySelector('.hwt-container').style.fontFamily = fontFamily;
  salvarDeclaracaoCSS();
}

function topFunction() {
  const beginner = document.getElementById('main-header');
  beginner.scrollIntoView({ behavior: 'smooth' });
}

function bottomFunction() {
  const endPage = document.querySelector('footer');
  endPage.scrollIntoView({ behavior: 'smooth' });
}

function topFunctionScene() {
  const beginner = document.getElementById('content_full');
  beginner.scrollTop = 0;
}

function bottomFunctionScene() {
  const beginner = document.getElementById('content_full');
  beginner.scrollTop = beginner.scrollHeight;
}

function onscrollUpAndDown() {
  window.onscroll = function scrollFunction() {
    const btn = document.getElementById('bottonButton');
    const btn2 = document.getElementById('topButton');
    if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && btn) {
      btn.style.display = 'block';
      btn2.style.display = 'block';
    } else if (btn) {
      document.getElementById('bottonButton').style.display = 'none';
      document.getElementById('topButton').style.display = 'none';
    }
  };
}

function onscrollUp() {
  window.onscroll = function scrollFunction() {
    const btn = document.getElementById('topButton');
    if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && btn) {
      btn.style.display = 'block';
    } else if (btn) {
      document.getElementById('topButton').style.display = 'none';
    }
  };
}

function setSelectionItalic(char) {
  const campoTexto = document.getElementById('content_full');
  const inicioSelecao = campoTexto.selectionStart;
  const fimSelecao = campoTexto.selectionEnd;
  const textoAntes = campoTexto.value.substring(0, inicioSelecao);
  const textoSelecionado = campoTexto.value.substring(inicioSelecao, fimSelecao);
  const textoDepois = campoTexto.value.substring(fimSelecao);
  campoTexto.value = `${textoAntes}${char}${textoSelecionado}${char}${textoDepois}`;
}

function getQtyCards(data) {
  const totalchar = data.characters.length;
  const totalworld = data.world.length;
  const totalscenes = data.scenes.length;
  const totalchapters = data.chapters.length;
  const totaltimeline = data.timeline.length;
  const totalnotes = data.notes.length;
  const result = totalchar + totalworld + totalscenes + totalchapters + totaltimeline + totalnotes;
  return result;
}

function tabInsideContent(elementID) {
  const textarea = document.getElementById(elementID);
  textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      this.value = `${this.value.substring(0, start)}    ${this.value.substring(end)}`;
      // eslint-disable-next-line no-multi-assign
      this.selectionStart = this.selectionEnd = start + 4;
    }
  });
}

function disableNavBar() {
  const navBarButtons = document.getElementById('Header');
  navBarButtons.style.display = 'none';
}

function restoreNavBar() {
  const navDiv = document.getElementById('Header');
  const navBarButtons = document.querySelectorAll('.navtrigger');
  navDiv.style.display = 'block';
  navBarButtons.forEach((buton) => {
    // eslint-disable-next-line no-param-reassign
    buton.classList = 'navtrigger tabInactive';
  });
  document.getElementById('dashboard').classList = 'navtrigger tabActive';
}
