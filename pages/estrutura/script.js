/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
changeTabColor('estrutura');

function validadeForm() {
  const dateField = document.getElementById('structureType').value;
  const date2Field = document.getElementById('structureName').value;
  return !!(dateField && date2Field !== '');
}

async function createNewStructure() {
  const ID = await idManager('id_structure');
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID();
  const structureName = document.getElementById('structureName');
  const structureCat = document.getElementById('structureType');
  const data = {
    title: structureName.value,
    content: '',
    position: 'Z',
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data[structureCat.value].push(data);
  });
  await updateLastEditList(structureCat.value, ID);
  await db.projects.update(pjID, { last_edit: currentDate, timestamp: timeStamp });
}

$('#dialogStructure').dialog({
  autoOpen: false,
  width: 600,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-structure',
      disabled: false,
      async click() {
        const validade = validadeForm();
        if (validade) {
          await createNewStructure();
          $(this).dialog('close');
          document.getElementById('structureName').value = '';
          document.getElementById('structureType').value = '';
          pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script.js');
        } else {
          alert('Por favor, preencha todas as informações!');
        }
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('structureName').value = '';
        document.getElementById('structureType').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog
$('#dialog-link-structure').click((event) => {
  $('#dialogStructure').dialog('open');
  $('#okBtn-structure').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('structureName').value = '';
  });
  event.preventDefault();
});

function checkStatus(data, status) {
  if (data.length === 0) {
    return false;
  }
  return data.every((obj) => obj.status === status);
}

function filterDataById(data, filterIDs) {
  if (Array.isArray(filterIDs)) {
    return data.filter((obj) => filterIDs.includes(obj.id));
  }

  return [];
}

function putScenesInChapters(arrayScenes, idPart, filterChapters) {
  arrayScenes.forEach((ele) => {
    if (filterChapters?.includes(ele.id)) {
      $(idPart).append(
        `
        <li onclick="loadpageOnclick('scenes', ${ele.id}, '#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')" class='liSceneOutline'>${ele.status === 'Pronto' ? "<span style='color: green'> 🗸 </span>" : ''}${ele.title}</li>
        `,
      );
    }
  });
}

function putChaptersInPat(arrayChapters, idPart, filterChapters, arrayScenes) {
  if (!filterChapters) {
    return arrayChapters.forEach((elem, i) => {
      const newfiltredScenes = filterDataById(arrayScenes, elem.scenes);
      const isAlldone = checkStatus(newfiltredScenes, 'Pronto');
      $(idPart).append(
        `
        <p onclick="loadpageOnclick('chapters', ${elem.id}, '#dinamic', 'components/detailChapter/page.html', 'components/detailChapter/script.js')" class="ChapterOutline" id='${elem.id}'>${isAlldone ? "<span style='color: green'>🗸 </span>" : ''}${elem.title}
        </p>
        <ul id="List${i}" class="SceneOutline"></ul>
        `,
      );
      putScenesInChapters(arrayScenes, `#List${i}`, elem.scenes);
    });
  }
  return arrayChapters.forEach((elem, i) => {
    if (filterChapters?.includes(elem.id)) {
      const newfiltredScenes = filterDataById(arrayScenes, elem.scenes);
      const isAlldone = checkStatus(newfiltredScenes, 'Pronto');
      $(idPart).append(
        `
        <p onclick="loadpageOnclick('chapters', ${elem.id}, '#dinamic', 'components/detailChapter/page.html', 'components/detailChapter/script.js')" class="ChapterOutline" id='${elem.id}'>${isAlldone ? "<span style='color: green'>🗸 </span>" : ''}${elem.title}
        </p>
        <ul id="List${i}" class="SceneOutline"></ul>
        `,
      );
      putScenesInChapters(arrayScenes, `#List${i}`, elem.scenes);
    }
  });
}

async function getStructureFiltred() {
  $('#project-list').empty();
  $('#project-list').append("<div id='outlineContent' class='cardStructure'></div>");
  const project = await getCurrentProject();
  putTabsAmount(project.data);
  const partsSorted = sortByKey(project.data.parts, 'position');
  const chaptersSorted = sortByKey(project.data.chapters, 'position');
  if (chaptersSorted.length === 0) {
    return $('#outlineContent').append('<p>No momento não existem cartões.</p><p>Crie capítulos (e adicione cenas) para visualizar a estrutura.</p>');
  }
  const scenesSorted = sortByKey(project.data.scenes, 'position');
  if (partsSorted[0]?.chapters?.length > 0) {
    return partsSorted.forEach(async (ele, i) => {
      $('#outlineContent').append(
        `
        <h3 onclick="loadpageOnclick('parts', ${ele.id}, '#dinamic', 'components/detailPart/page.html', 'components/detailPart/script.js')" class="PartOutline">${ele.title}
        <hr class="chapterLine">
        </h3>
        <p id="partList${i}" style="margin: 0px"></p>
        `,
      );
      putChaptersInPat(chaptersSorted, `#partList${i}`, ele.chapters, scenesSorted);
    });
  }

  return putChaptersInPat(chaptersSorted, '#outlineContent', null, scenesSorted);
}

function recovLastTabStructure() {
  const tabs = document.querySelectorAll('.target');
  for (let index = 0; index < tabs.length; index += 1) {
    const element = tabs[index];
    element.classList = 'innerTabInactive target';
  }
  const tab = localStorage.getItem('StructureLastTab');
  if (tab === 'OUTLINE') {
    document.getElementById('subplotsTab').classList = 'innerTabActive target';
    getStructureFiltred();
  } else if (tab === 'CHAPTER') {
    document.getElementById('chaptersTab').classList = 'innerTabActive target';
    pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script_chapters.js');
  } else {
    document.getElementById('partsTab').classList = 'innerTabActive target';
    pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script_parts.js');
  }
}

function setLastTabStructure(tab) {
  const tabs = document.querySelectorAll('.target');
  for (let index = 0; index < tabs.length; index += 1) {
    const element = tabs[index];
    element.classList = 'innerTabInactive target';
  }
  switch (tab) {
    case 'OUTLINE':
      document.getElementById('subplotsTab').classList = 'innerTabActive target';
      localStorage.setItem('StructureLastTab', 'OUTLINE');
      pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script.js');
      break;
    case 'CHAPTER':
      document.getElementById('chaptersTab').classList = 'innerTabActive target';
      localStorage.setItem('StructureLastTab', 'CHAPTER');
      pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script_chapters.js');
      break;
    case 'PART':
      document.getElementById('partsTab').classList = 'innerTabActive target';
      localStorage.setItem('StructureLastTab', 'PART');
      pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script_parts.js');
      break;
    default:
      break;
  }
}

setStructureTabs();
recovLastTabStructure();
validateNewCard('structureName', '#okBtn-structure');
validateNewCard('structureType', '#okBtn-structure');
document.getElementById('project-list').className = 'worldListStructure';
