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

async function loadpage(pagename) {
  const response = await fetch(`pages/${pagename}/page.html`);
  const html = await response.text();
  const dynamic = document.getElementById('dinamic');
  dynamic.innerHTML = html;

  const script = document.createElement('script');
  script.src = `pages/${pagename}/script.js`;
  dynamic.appendChild(script);
}

function loadpageDetail(detailPage) {
  pageChange('#dinamic', `components/${detailPage}/page.html`, `components/${detailPage}/script.js`);
}

async function loadpageOnclick(card, id, idCall, pagaCall, scriptCall) {
  await db.settings.update(1, { currentCard: card, currendIdCard: id });
  return pageChange(idCall, pagaCall, scriptCall);
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
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --' || value === '-- nenhum --') {
      return null;
    }
    return $('.innerTabDefault').append($(`<button class='innerTabInactive target' onclick="setFilterCategory('${value}', '${value}')" id='${value}'></button>`).html(value));
  });
}

function povFilterLoadPage(id) {
  localStorage.setItem('idPovFilter', id);
  pageChange('#dinamic', 'components/filtredPovScene/page.html', 'components/filtredPovScene/script.js');
}

function chapterFilterLoadPage(id) {
  localStorage.setItem('chapterFilter', id);
  pageChange('#dinamic', 'components/filtredPovScene/page.html', 'components/filtredPovScene/script_chapter.js');
}

async function setCustomPovTabs(type, callback) {
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --' || value === '-- nenhum --') {
      return null;
    }
    const povID = project.data.characters.map((e) => e.id).indexOf(Number(value));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    return $('.innerTabDefault').append($(`<button id='${value}' class='innerTabInactive target' onclick="povFilterLoadPage(${value})"'></button>`).html(povName));
  });
  if (callback) {
    callback(); // chama a função de callback, se fornecida
  }
}

async function setCustomTimelineTabs(type, callback) {
  const project = await getCurrentProject();
  const categoryList = project.settings[type];
  $.each(categoryList, (i, value) => {
    if (value === '-- selecione --' || value === '-- nenhum --') {
      return null;
    }
    const povID = project.data.characters.map((e) => e.id).indexOf(Number(value));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    return $('.innerTabDefault').append($(`<button id='tab${value}' class='innerTabInactive target' onclick="geTimelineFiltred('${value}')"'></button>`).html(povName));
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
    const isChapterPresent = filtredParts.some((part) => part.chapters.includes(value.id));
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
