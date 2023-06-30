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

// eslint-disable-next-line no-unused-vars
function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getScenesCardsFiltred(filterCategory);
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
        <ul class="worldListScenes ${!ele.status ? '' : ` ${ele.status}-Status`}" id="${ele.id}">
          <li class="worldItens">
            <div class="ui-widget-content portlet ui-corner-all">
              <div class="contentListWorld">
                <div data-testid='scene-${ele.id}' class="ui-widget-header ui-corner-all portlet-header">${ele.title}</div>
                  <a onclick="loadpageOnclick('scenes', ${ele.id}, '#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')">
                  <p class="infosCardScenes"><span class="povLabel" style="background-color:${ele.pov_id ? povColor : ''}">${!ele.pov_id ? '&nbsp;&nbsp;&nbsp' : povName}</span> 
                  ${!ele.status ? '' : ` ${ele.status}`}
                  ${!ele.date ? '' : `• ${dateConverted}`}
                  </p>
                  <p class="infosCardScenes">${!chapterName ? '' : `Cap. ${chapterName}`}</p>
                  <div>  
                    <p class="sceneCartContent">${ele.content}</p>
                  </div>
                  </a>
              </div>
            </div>
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

function ocultarElementos(status) {
  $('#project-list').sortable('destroy');
  const elementos = document.getElementsByClassName('worldListScenes');
  for (let i = 0; i < elementos.length; i += 1) {
    const elemento = elementos[i];
    if (!elemento.classList.contains(status)) {
      elemento.style.display = 'none';
    }
  }
  document.getElementById('meu-select').disabled = true;
  document.getElementById('clear_status').style.display = 'inline';
}

$(() => {
  $('#project-list').disableSelection();
  function savePositions() {
    // eslint-disable-next-line func-names
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
    update() {
      savePositions();
    },
  });
});

function clearStatusFilter() {
  loadpage('cenas');
}

function topFunction() {
  document.body.scrollTop = 0; // Para navegadores Safari
  document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE e Opera
}

window.onscroll = function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById('topButton').style.display = 'block';
  } else {
    document.getElementById('topButton').style.display = 'none';
  }
};
