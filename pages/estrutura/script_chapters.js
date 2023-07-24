/* eslint-disable no-alert */
/* eslint-disable no-undef */

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
          pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script_chapters.js');
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

async function getStructureFiltred(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  putTabsAmount(project.data);
  const resultSorted = sortByKey(project.data[filter], 'position');
  resultSorted.forEach((ele, i) => {
    $('#project-list').append(
      `
      <ul class="worldListStructure" id="${ele.id}" data-testid='chapter-${ele.id}'>
        <li class="worldItens">
          <div class="worldName portlet ui-corner-all">
            <div class="contentListWorld">
              <div class="ui-widget-header ui-corner-all portlet-header">Capítulo ${i + 1} - ${ele.title}</div>
              <a data-testid='chapter-link-${ele.id}' onclick="loadpageOnclick('chapters', ${ele.id}, '#dinamic', 'components/detailChapter/page.html', 'components/detailChapter/script.js')">
                <p class="infosCardScenes">${!ele.status ? '' : ele.status}</p>
                <div>
                  <p class="sceneCartContent">${ele.content ? ele.content : '<br>'}</p>
                </div>
              </a>
            </div>
          </div>
        </li>
      </ul>
      `,
    );
    setContentOpacity();
  });
}

getStructureFiltred('chapters');
setStructureTabs('chap');
validateNewCard('structureName', '#okBtn-structure');
validateNewCard('structureType', '#okBtn-structure');
document.getElementById('project-list').className = 'worldListStructure';

$(() => {
  $('#project-list').disableSelection();
  async function savePositions() {
    const worldListStructure = $('#project-list .worldListStructure');
    const currentID = await getCurrentProjectID();
    for (let i = 0; i < worldListStructure.length; i += 1) {
      const id = $(worldListStructure[i]).attr('id');
      const position = $(worldListStructure[i]).index();
      // eslint-disable-next-line no-await-in-loop
      const positionInDB = await getStructureByID('chapters', Number(id));
      // eslint-disable-next-line no-await-in-loop
      await db.projects.where('id').equals(currentID).modify((ele) => {
        // eslint-disable-next-line no-param-reassign
        ele.data.chapters[positionInDB].position = position;
      });
    }
    pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script_chapters.js');
  }
  $('#project-list').sortable({
    update() {
      savePositions();
    },
  });
});
