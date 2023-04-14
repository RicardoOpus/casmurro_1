/* eslint-disable no-undef */
changeTabColor('mundo');

async function enableDateInput(target) {
  const divDate = document.getElementById('div_Date');
  if (target === 'Fato histórico') {
    divDate.removeAttribute('style');
  } else {
    divDate.style.display = 'none';
  }
  if (target !== 'Fato histórico') {
    clearDate('world');
  }
}

document.getElementById('category').addEventListener('change', (e) => enableDateInput(e.target.value));

async function restoreCharactersCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.world.forEach((ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach((key) => {
        const result = document.getElementById(key);
        if (key === 'date' && ele[key] !== '') {
          const divDate = document.getElementById('div_Date');
          divDate.removeAttribute('style');
          const resultDate = projectData.data.timeline
            .filter((timelineElement) => timelineElement.id === ele[key]);
          result.value = resultDate[0].date;
          return result.value;
        } if (key === 'image_card' && ele[key] !== '') {
          const cardbackgrond = document.getElementById('imageCardBackgournd');
          cardbackgrond.classList.add('imageCardBackgournd');
          cardbackgrond.children[0].style.backgroundImage = `url(${ele[key]})`;
          cardbackgrond.children[0].classList.add('cardImageDiv');
          result.setAttribute('src', ele[key]);
          result.classList.add('cardImage');
        } if (result) {
          result.value = ele[key];
          return result.value;
        }
        return null;
      });
      resumeHeight('content');
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
    projectData.data.world.forEach((ele) => {
      if (ele.id === currentCardID) {
        elem.addEventListener('input', async () => {
          await lastEditListModify('world', currentCardID);
          const field = elem.id;
          if (elem.id === 'date') {
            const checkIfisNew = await checkTimelineNewDate(ele.id, 'historical-event', 'historicID');
            if (checkIfisNew) {
              const projectDataActual = await getCurrentProject();
              const actualIDdateFact = projectDataActual.data.world[positionInArray].date;
              const positionInArrayTime = projectDataActual.data.timeline
                .map((e) => e.id).indexOf(actualIDdateFact);
              await db.projects.where('id').equals(currentID).modify((e) => {
                e.data.timeline[positionInArrayTime].date = elem.value;
              });
            }
            const timelineID = await NewTimelineGenericWorld(elem.value, ele.id, 'historical-event');
            await db.projects.where('id').equals(currentID).modify((e) => {
              e.data.world[positionInArray][field] = timelineID;
            });
          }
          await db.projects.where('id').equals(currentID).modify((e) => {
            e.data.world[positionInArray][field] = elem.value;
          });
          updateLastEdit(currentID);
        });
      }
    });
  });
}
saveValues();

$('#dialog-delete-world').dialog({
  autoOpen: false,
  width: 500,
  buttons: [
    {
      text: 'Ok',
      async click() {
        await clearDate('world');
        await deleteCard('world');
        $(this).dialog('close');
        loadpage('mundo');
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
$('#deleteWorldCard').click((event) => {
  $('#dialog-delete-world').dialog('open');
  $('#btnTwo').focus();
  event.preventDefault();
});

document.getElementById('btnSaveWall').disabled = true;
document.getElementById('my-image').addEventListener('input', () => {
  document.getElementById('btnSaveWall').disabled = false;
});

restoreCharactersCard();
restoreCategories('world');
