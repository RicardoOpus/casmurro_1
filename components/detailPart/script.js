/* eslint-disable no-undef */
changeTabColor('estrutura');

async function applyChapterslist(id, idChars) {
  const project = await getCurrentProject();
  $(id).empty();
  $(id).append($('<h3></h3>').val('').html('Lista de capítulos:'));
  const resultSorted = sortByKey(project.data.chapters, 'position');
  resultSorted.forEach((ele) => {
    if (idChars.includes(ele.id)) {
      return $(id).append($(`<button onclick="loadpageOnclick('parts', ${ele.id}, '#dinamic', 'components/detailChapter/page.html', 'components/detailChapter/script.js')" style='margin: 5px; color: black; background-color: #8F8F8F; border-radius: 5px; padding: 5px; cursor: pointer'></button><br>`).html(ele.title));
    }
    return null;
  });
}

async function restorePartCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.parts.forEach((ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(async (key) => {
        const result = document.getElementById(key);
        if (key === 'chapters') {
          await applyChapterslist('#chapter_list', ele[key]);
          if (ele[key].length === 0) {
            document.getElementById('chapter_list').innerHTML = '';
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

function saveValues() {
  const elementsArray = document.querySelectorAll('.projectInputForm');
  elementsArray.forEach(async (elem) => {
    const currentID = await getCurrentProjectID();
    const currentCardID = await getCurrentCardID();
    const projectData = await getCurrentProject();
    const positionInArray = await getCurrentCard();
    projectData.data.parts.forEach((ele) => {
      if (ele.id === currentCardID) {
        elem.addEventListener('input', async () => {
          await lastEditListModify('parts', currentCardID);
          const field = elem.id;
          await db.projects.where('id').equals(currentID).modify((e) => {
            e.data.parts[positionInArray][field] = elem.value;
          });
          updateLastEdit(currentID);
        });
      }
    });
  });
}
saveValues();

$('#dialog-delete-part').dialog({
  autoOpen: false,
  width: 500,
  buttons: [
    {
      text: 'Ok',
      async click() {
        await deleteCard('parts');
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
$('#deletePartCard').click((event) => {
  $('#dialog-delete-part').dialog('open');
  $('#btnTwo').focus();
  event.preventDefault();
});

restorePartCard();

async function saveCheckedValues() {
  const form = document.getElementById('chapterToPart');
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
    e.data.parts[positionInArray].chapters = checkedValues;
  });
}

$('#dialog-addChaptersToPart').dialog({
  autoOpen: false,
  width: 500,
  maxHeight: 600,
  buttons: [
    {
      text: 'Ok',
      async click() {
        await saveCheckedValues();
        $(this).dialog('close');
        restorePartCard();
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
$('#btn-addChaptersToPart').click((event) => {
  $('#dialog-addChaptersToPart').dialog('open');
  $('#btnTwo').focus();
  event.preventDefault();
});

restoreChapListInput('#chapterToPart');
