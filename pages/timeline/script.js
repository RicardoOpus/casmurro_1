/* eslint-disable no-alert */
/* eslint-disable no-undef */
changeTabColor('timeline');

function validadeForm() {
  const dateField = document.getElementById('timelineDate').value;
  return dateField !== '';
}

function validadeDatesInputs() {
  const date1 = document.getElementById('date1_ElapsedTime').value;
  const date2 = document.getElementById('date2_ElapsedTime').value;
  return date1 !== '' && date2 !== '';
}

function showElapsedtime() {
  const divtarget = document.getElementById('elipsedTimeResult');
  divtarget.innerHTML = '';
  const date1 = document.getElementById('date1_ElapsedTime').value;
  const date2 = document.getElementById('date2_ElapsedTime').value;
  const element = document.createElement('p');
  const result = calculateTimeElapsed(date1, date2);
  element.innerText = `Passaram-se ${result.years} anos, ${result.months} meses e ${result.days} dias`;
  divtarget.appendChild(element);
}

async function createNewTimeline() {
  const ID = await idManager('id_timeline');
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID();
  const timelineName = document.getElementById('timelineName');
  const timelineDate = document.getElementById('timelineDate');
  const data = {
    title: timelineName.value,
    elementType: '',
    elementID: '',
    content: '',
    date: timelineDate.value,
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.timeline.push(data);
  });
  await updateLastEditList('timeline', ID);
  await db.projects.update(pjID, { last_edit: currentDate, timestamp: timeStamp });
}

$('#dialogTimeline').dialog({
  autoOpen: false,
  width: 600,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-timeline',
      disabled: false,
      async click() {
        const validade = validadeForm();
        if (validade) {
          await createNewTimeline();
          $(this).dialog('close');
          document.getElementById('timelineName').value = '';
          document.getElementById('timelineDate').value = '';
          pageChange('#dinamic', 'pages/timeline/page.html', 'pages/timeline/script.js');
        } else {
          alert('Por favor, preencha a data!');
        }
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('timelineName').value = '';
        document.getElementById('timelineDate').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog
$('#dialog-link-timeline').click((event) => {
  $('#dialogTimeline').dialog('open');
  $('#okBtn-timeline').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('timelineName').value = '';
    document.getElementById('timelineDate').value = '';
  });
  event.preventDefault();
});

$('#dialog_new_timelineCategory').dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-cat-time',
      disabled: false,
      async click() {
        const filterChar = document.getElementById('catCharacterName');
        await addNewCategory('timeline', filterChar.value);
        $(this).dialog('close');
        document.getElementById('catCharacterName').value = '';
        pageChange('#dinamic', 'pages/timeline/page.html', 'pages/timeline/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('catCharacterName').value = '';
        $(this).dialog('close');
      },
    }],
});
$('#dialog-link-character-filter').click((event) => {
  $('#dialog_new_timelineCategory').dialog('open');
  $('#okBtn-cat-time').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('catCharacterName').value = '';
  });
  restorePOV('#catCharacterName', 'characters');
  event.preventDefault();
});

$('#dialog_delete_timelineCategory').dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-delcatTimeline',
      disabled: false,
      async click() {
        const catDel = document.getElementById('categoryDeltimelineName');
        await removeCategory('timeline', catDel.value);
        $(this).dialog('close');
        document.getElementById('categoryDeltimelineName').value = '';
        pageChange('#dinamic', 'pages/timeline/page.html', 'pages/timeline/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('categoryDeltimelineName').value = '';
        $(this).dialog('close');
      },
    }],
});
$('#dialog-link-delcategory').click((event) => {
  $('#dialog_delete_timelineCategory').dialog('open');
  $('#okBtn-delcatTimeline').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('categoryDeltimelineName').value = '';
  });
  restoreDelPovTab('timeline', '#categoryDeltimelineName');
  event.preventDefault();
});

$('#elapsedTime').dialog({
  autoOpen: false,
  width: 600,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-elapsedTime',
      disabled: false,
      async click() {
        const validade = validadeDatesInputs();
        if (validade) {
          showElapsedtime();
          document.getElementById('timelineName').value = '';
          document.getElementById('timelineDate').value = '';
        } else {
          alert('Por favor, preencha as duas datas!');
        }
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('timelineName').value = '';
        document.getElementById('timelineDate').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog Elapsedtime
$('#dialog-link-elapsedTime').click((event) => {
  $('#elapsedTime').dialog('open');
  $('#okBtn-timeline').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('timelineName').value = '';
    document.getElementById('timelineDate').value = '';
  });
  restoreTimelineDates('#date1_ElapsedTime', 'timeline');
  restoreTimelineDates('#date2_ElapsedTime', 'timeline');
  event.preventDefault();
});

function handleTitle(type) {
  let result;
  switch (type) {
    case 'characters-death':
      result = '🪦 Morre ';
      break;
    case 'characters-birth':
      result = '✶ Nasce ';
      break;
    case 'scene':
      result = '🎬 ';
      break;
    case 'historical-event':
      result = '🗓 ';
      break;
    default:
      result = '';
  }
  return result;
}

function tableName(name) {
  let result;
  switch (name) {
    case 'characters-death':
      result = 'characters';
      break;
    case 'characters-birth':
      result = 'characters';
      break;
    case 'scene':
      result = 'scenes';
      break;
    case 'historical-event':
      result = 'world';
      break;
    default:
      result = '';
  }
  return result;
}

async function getElementTitle(type, elementID) {
  const table = tableName(type);
  if (table) {
    const project = await getCurrentProject();
    const element = project.data[table].map((e) => e.id).indexOf(elementID);
    const resultName = project.data[table][element].title;
    const resultColor = project.data[table][element].color;
    return { name: resultName, color: resultColor };
  }
  return '';
}

function removeDuplicateIds() {
  const allIds = document.querySelectorAll('[id]');
  const seenIds = {};
  allIds.forEach((el) => {
    const id = el.getAttribute('id');
    if (seenIds[id]) {
      el.parentNode.removeChild(el);
    } else {
      seenIds[id] = true;
    }
  });
}

function getCharColor(id, characters) {
  if (id) {
    const char = characters.filter((ele) => ele.id === id);
    return char[0].color;
  }
  return null;
}

function getColor(charName, selectedCharColor) {
  if (charName.color) {
    return charName.color;
  } if (selectedCharColor) {
    return selectedCharColor;
  }
  return '#2D333B';
}

async function getTimeline() {
  const project = await getCurrentProject();
  putTabAllAmount(project.data.timeline);
  const resultSorted = sortByDate(project.data.timeline);
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>");
  }
  let prevDate = null;
  let prevLi = null;
  for (let i = 0; i < resultSorted.length; i += 1) {
    const ele = resultSorted[i];
    const dateConverted = convertDatePTBR(ele.date);
    const symbolTitle = handleTitle(ele.elementType);
    const identfyType = ele.elementID || ele.historicID || ele.sceneID;
    // eslint-disable-next-line no-await-in-loop
    const charName = await getElementTitle(ele.elementType, identfyType);
    const selectedCharColor = getCharColor(Number(ele.pov_id), project.data.characters);
    if (dateConverted === prevDate) {
      prevLi.find('p').append(`
      <a data-testid='timeline-item-${ele.id}' class="${ele.title ? '' : 'noPonter'}" onclick="${ele.title ? `loadpageOnclick('timeline', ${ele.id}, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
        <div id="${ele.id}" class="time" style="background: linear-gradient(to right, ${getColor(charName, selectedCharColor)} 0%, #2D333B 85%); color: ${charName.color || selectedCharColor ? 'black' : ''}">${symbolTitle} ${ele.title ? ele.title : charName.name}</div>
        </a>
        <p><a data-testid='timeline-content-${ele.id}' class="${ele.title ? '' : 'noPonter'}" onclick="${ele.title ? `loadpageOnclick('timeline', ${ele.id}, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ele.content}</a></p>
      `);
    } else {
      prevDate = dateConverted;
      const li = $(`
      <li>
        <div class="timeline-section" id='timeline-element-${ele.id}'>
          <a data-testid='timeline-item-${ele.id}' class="${ele.title ? '' : 'noPonter'}" onclick="${ele.title ? `loadpageOnclick('timeline', ${ele.id}, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
            <div class="timeDate">${dateConverted}</div>
            <div class="time" style="background: linear-gradient(to right, ${getColor(charName, selectedCharColor)} 0%, #2D333B 85%); color: ${charName.color || selectedCharColor ? 'black' : ''}">${symbolTitle} ${ele.title ? ele.title : charName.name}</div>
            </a>
            <p><a data-testid='timeline-content-${ele.id}' class="${ele.title ? '' : 'noPonter'}" onclick="${ele.title ? `loadpageOnclick('timeline', ${ele.id}, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ele.content}</a></p>
        </div>
      </li>
      `);
      prevLi = li;
      $('#timelineMain').append(li);
    }
  }
  return removeDuplicateIds();
}

function checkObject(obj, id) {
  if (obj.elementType && obj.elementType.startsWith('characters') && obj.elementID === id) {
    return true;
  }
  return false;
}

async function geTimelineFiltred(filter) {
  $('#timelineMain').empty();
  const project = await getCurrentProject();
  putTabAllAmount(project.data.timeline);
  const resultSorted = sortByDate(project.data.timeline);
  let prevDate = null;
  let prevLi = null;
  for (let i = 0; i < resultSorted.length; i += 1) {
    const ele = resultSorted[i];
    if (ele.pov_id === filter || checkObject(ele, Number(filter))) {
      const dateConverted = convertDatePTBR(ele.date);
      const symbolTitle = handleTitle(ele.elementType);
      // eslint-disable-next-line no-await-in-loop
      const charName = await getElementTitle(ele.elementType, ele.elementID);
      const selectedCharColor = getCharColor(Number(ele.pov_id), project.data.characters);
      if (dateConverted === prevDate) {
        prevLi.find('p').append(`
        <a data-testid='timeline-item-${ele.id}' class="${ele.title ? '' : 'noPonter'}" onclick="${ele.title ? `loadpageOnclick('timeline', ${ele.id}, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
          <div id="${ele.id}" class="time" style="background: linear-gradient(to right, ${getColor(charName, selectedCharColor)} 0%, #2D333B 85%); color: ${charName.color || selectedCharColor ? 'black' : ''}">${symbolTitle} ${ele.title ? ele.title : charName.name}</div>
          </a>
          <p><a data-testid='timeline-content-${ele.id}' class="${ele.title ? '' : 'noPonter'}" onclick="${ele.title ? `loadpageOnclick('timeline', ${ele.id}, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ele.content}</a></p>
        `);
      } else {
        prevDate = dateConverted;
        const li = $(`
        <li>
          <div class="timeline-section" id='timeline-element-${ele.id}'>
            <a data-testid='timeline-item-${ele.id}' class="${ele.title ? '' : 'noPonter'}" onclick="${ele.title ? `loadpageOnclick('timeline', ${ele.id}, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
              <div class="timeDate">${dateConverted}</div>
              <div class="time" style="background: linear-gradient(to right, ${getColor(charName, selectedCharColor)} 0%, #2D333B 85%); color: ${charName.color || selectedCharColor ? 'black' : ''}">${symbolTitle} ${ele.title ? ele.title : charName.name}</div>
              </a>
              <p><a data-testid='timeline-content-${ele.id}' class="${ele.title ? '' : 'noPonter'}" onclick="${ele.title ? `loadpageOnclick('timeline', ${ele.id}, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ele.content}</a></p>
          </div>
        </li>
        `);
        prevLi = li;
        $('#timelineMain').append(li);
      }
    }
    removeDuplicateIds();
  }
  changeInnerTabColor(filter);
}

function reduceString(str) {
  if (str.length > 35) {
    return `${str.slice(0, 35)}...`;
  }
  return str;
}

// eslint-disable-next-line no-unused-vars
async function getTimelineSimle(id) {
  const project = await getCurrentProject();
  const resultSorted = sortByDate(project.data.timeline);
  for (let i = 0; i < resultSorted.length; i += 1) {
    const ele = resultSorted[i];
    const dateConverted = convertDatePTBR(ele.date);
    const symbolTitle = handleTitle(ele.elementType);
    // eslint-disable-next-line no-await-in-loop
    const charName = await getElementTitle(ele.elementType, ele.elementID);
    const titleShort = reduceString(ele.title);
    $(id).append(
      `
      <option value='${ele.date}'>
        <div> ${dateConverted} - ${symbolTitle} ${ele.title ? titleShort : charName.name}</div>
      </option>
      `,
    );
  }
}

// eslint-disable-next-line no-unused-vars
function setFilterCategory(tab, filterCategory) {
  localStorage.setItem('tabTimeline', filterCategory);
  if (tab === 'All') {
    loadpage('timeline');
  } else {
    geTimelineFiltred(filterCategory);
  }
}

async function recovLastTabScenePOV(table, tableNameTab) {
  await setCustomTimelineTabs(table);
  const savedTab = localStorage.getItem(tableNameTab);
  const tab = document.getElementById(savedTab);
  // console.log('entrou no if', tab.id);
  if (tab) {
    geTimelineFiltred(tab.id);
  } else {
    getTimeline();
  }
}

recovLastTabScenePOV('timeline', 'tabTimeline');
validateNewCard('timelineName', '#okBtn-timeline');
validateNewCard('catCharacterName', '#okBtn-cat-time');
validateNewCard('categoryDeltimelineName', '#okBtn-delcatTimeline');
