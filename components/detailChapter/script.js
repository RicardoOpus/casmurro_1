/* eslint-disable no-undef */
changeTabColor('estrutura');

async function applySceneslist(id, idChars) {
  const project = await getCurrentProject();
  $(id).empty();
  $(id).append($('<h3></h3>').val('').html('Lista de cenas:'));
  const resultSorted = sortByKey(project.data.scenes, 'position');
  resultSorted.forEach((ele) => {
    if (idChars.includes(ele.id)) {
      return $(id).append($(`<button onclick="loadpageOnclick('scenes', ${ele.id}, '#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')" style='margin: 5px; color: black; background-color: #8F8F8F; border-radius: 5px; padding: 5px; cursor: pointer'></button><br>`).html(ele.title));
    }
    return null;
  });
}

async function restoreChapterCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.chapters.forEach((ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(async (key) => {
        const result = document.getElementById(key);
        if (key === 'scenes') {
          await applySceneslist('#scenes_list', ele[key]);
          if (ele[key].length === 0) {
            document.getElementById('scenes_list').innerHTML = '';
          }
        } if (result) {
          result.value = ele[key];
          return result.value;
        }
        return null;
      });
      resumeHeight('content', 'content_full');
    }
  });
}

function updateValues() {
  const elementsArray = document.querySelectorAll('.projectInputForm');
  elementsArray.forEach(async (elem) => {
    const currentID = await getCurrentProjectID();
    const currentCardID = await getCurrentCardID();
    const projectData = await getCurrentProject();
    const positionInArray = await getCurrentCard();
    projectData.data.chapters.forEach((ele) => {
      if (ele.id === currentCardID) {
        elem.addEventListener('input', async () => {
          await lastEditListModify('chapters', currentCardID);
          const field = elem.id;
          await db.projects.where('id').equals(currentID).modify((e) => {
            e.data.chapters[positionInArray][field] = elem.value;
          });
          updateLastEdit(currentID);
        });
      }
    });
  });
}

$('#dialog-delete-chapter').dialog({
  autoOpen: false,
  width: 500,
  buttons: [
    {
      text: 'Ok',
      async click() {
        await deleteCard('chapters');
        $(this).dialog('close');
        loadpage('estrutura');
      },
    },
    {
      text: 'Cancel',
      id: 'btnTwo',
      click() {
        $(this).dialog('close');
      },
    },
  ],
});
// Link to open the dialog
$('#deleteChapterCard').click((event) => {
  $('#dialog-delete-chapter').dialog('open');
  $('#btnTwo').focus();
  event.preventDefault();
});

restoreChapterCard();
updateValues();

async function saveCheckedValues() {
  const form = document.getElementById('scenesToChapter');
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const checkedValues = [];
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.push(Number(checkbox.value));
    }
  });
  db.projects.where('id').equals(currentID).modify((e) => {
    e.data.chapters[positionInArray].scenes = checkedValues;
  });
}

$('#dialog-addScenetoChap').dialog({
  autoOpen: false,
  width: 500,
  maxHeight: 600,
  buttons: [
    {
      text: 'Ok',
      async click() {
        await saveCheckedValues();
        $(this).dialog('close');
        restoreChapterCard();
      },
    },
    {
      text: 'Cancel',
      id: 'btnTwo',
      click() {
        $(this).dialog('close');
      },
    },
  ],
});
// Link to open the dialog
$('#btn-addSceneToChap').click((event) => {
  $('#dialog-addScenetoChap').dialog('open');
  $('#btnTwo').focus();
  event.preventDefault();
});

restoreScenesListInput('#scenesToChapter');
