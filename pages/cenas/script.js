/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
changeTabColor('cenas');

async function createNewScene() {
  const ID = await idManager('id_scenes');
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID();
  const sceneName = document.getElementById('sceneName');
  const data = {
    title: sceneName.value,
    position: 'Z',
    content: '',
    date: '',
    pov_id: '',
    place_id: '',
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.scenes.push(data);
  });
  await updateLastEditList('scenes', ID);
  await db.projects.update(pjID, { last_edit: currentDate, timestamp: timeStamp });
}

function autoChapterFilter(project) {
  const resultSorted = sortByKey(project.data.chapters, 'position');
  const tab = document.querySelector('.innerTabChapters');
  if (resultSorted.length > 0) {
    const chapDivider = document.createElement('h3');
    chapDivider.innerHTML = 'Capítulos:<hr>';
    tab.appendChild(chapDivider);
    for (let i = 0; i < resultSorted.length; i += 1) {
      const chapter = resultSorted[i];
      const chapterItem = document.createElement('div');
      chapterItem.innerHTML = `<p onclick="chapterFilterLoadPage(${chapter.id})">${chapter.title}</p><div class="dashboard-divisor2"><div>`;
      tab.appendChild(chapterItem);
    }
  }
}

$('#dialogScene').dialog({
  autoOpen: false,
  width: 600,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-scene',
      disabled: false,
      async click() {
        await createNewScene();
        $(this).dialog('close');
        document.getElementById('sceneName').value = '';
        pageChange('#dinamic', 'pages/cenas/page.html', 'pages/cenas/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('sceneName').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog
$('#dialog-link-scene').click((event) => {
  $('#dialogScene').dialog('open');
  $('#okBtn-scene').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('sceneName').value = '';
  });
  event.preventDefault();
});

$('#dialog_new_pov').dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-cat',
      disabled: false,
      async click() {
        const catPOV = document.getElementById('povName');
        await addNewCategory('scenes', catPOV.value);
        $(this).dialog('close');
        document.getElementById('povName').value = '';
        pageChange('#dinamic', 'pages/cenas/page.html', 'pages/cenas/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('povName').value = '';
        $(this).dialog('close');
      },
    }],
});
$('#dialog-link-category').click((event) => {
  $('#dialog_new_pov').dialog('open');
  $('#okBtn-cat').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('povName').value = '';
  });
  restorePOV('#povName', 'characters');
  event.preventDefault();
});

$('#dialog_delete_pov').dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-delpov',
      disabled: false,
      async click() {
        const catDelPov = document.getElementById('povDelName');
        await removeCategory('scenes', catDelPov.value);
        $(this).dialog('close');
        document.getElementById('povDelName').value = '';
        pageChange('#dinamic', 'pages/cenas/page.html', 'pages/cenas/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('povDelName').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog Delete Category
$('#dialog-link-delcategory').click((event) => {
  $('#dialog_delete_pov').dialog('open');
  $('#okBtn-delpov').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('povDelName').value = '';
  });
  restoreDelPovTab('scenes', '#povDelName');
  event.preventDefault();
});

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getScenesCardsFiltred(filterCategory);
}

async function getScenesdCards() {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.scenes, 'position');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>");
  }
  resultSorted.forEach((ele) => {
    const povID = project.data.characters.map((e) => e.id).indexOf(Number(ele.pov_id));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    const povColor = project?.data?.characters?.[povID]?.color ?? '';
    const resultDate = project.data.timeline.map((e) => e.id).indexOf(Number(ele.date));
    const dateValue = project?.data?.timeline?.[resultDate]?.date ?? '';
    const chapters = project?.data?.chapters;
    const chapterName = getChapterName(chapters, ele.id);
    const dateConverted = convertDatePTBR(dateValue);
    $('#project-list').append(
      `
        <ul class="worldListScenes" id="${ele.id}">
          <li class="worldItens">
          <div class="ui-widget-content portlet ui-corner-all">
          <div class="contentListWorld">
          <div class="ui-widget-header ui-corner-all portlet-header">${ele.title}
          <a onclick="loadpageOnclick('scenes', ${ele.id}, '#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')">
            </div>
              <p class="infosCardScenes"><span class="povLabel" style="background-color:${ele.pov_id ? povColor : ''}">${!ele.pov_id ? '&nbsp;&nbsp;&nbsp' : povName}</span> 
              ${!ele.status ? '' : ` ${ele.status}`}
                ${!ele.date ? '' : `• ${dateConverted}`}
              </p>
              <p class="infosCardScenes">${!chapterName ? '' : `Cap. ${chapterName}`}</p>
            </div>
            <div>  
              <p class="sceneCartContent">${ele.content}</p>
            </div>
            </div>
          </a>
          </li>
        </ul>
      `,
    );
    setContentOpacity();
    setImageOpacity();
  });
  return autoChapterFilter(project);
}

setCustomPovTabs('scenes');
getScenesdCards();
validateNewCard('sceneName', '#okBtn-scene');
validateNewCard('povName', '#okBtn-cat');
validateNewCard('povDelName', '#okBtn-delpov');
document.getElementById('project-list').className = 'listCardsScenes';

$(() => {
  $('#project-list').disableSelection();
  function savePositions() {
    $('#project-list .worldListScenes').each(async function () {
      const id = $(this).attr('id');
      const position = $(this).index();
      const currentID = await getCurrentProjectID();
      const positionInDB = await getCurrentScene(Number(id));
      db.projects.where('id').equals(currentID).modify((ele) => {
        // eslint-disable-next-line no-param-reassign
        ele.data.scenes[positionInDB].position = position;
      });
    });
  }
  $('#project-list').sortable({
    update(event, ui) {
      savePositions();
    },
  });
});
