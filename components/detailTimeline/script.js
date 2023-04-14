/* eslint-disable no-undef */
changeTabColor('timeline');

async function restoreCharactersCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.timeline.forEach((ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach((key) => {
        const result = document.getElementById(key);
        if (result) {
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
    projectData.data.timeline.forEach((ele) => {
      if (ele.id === currentCardID) {
        elem.addEventListener('input', async () => {
          await lastEditListModify('timeline', currentCardID);
          const field = elem.id;
          await db.projects.where('id').equals(currentID).modify((e) => {
            e.data.timeline[positionInArray][field] = elem.value;
          });
          updateLastEdit(currentID);
        });
      }
      return null;
    });
  });
}
saveValues();

$('#dialog-delete-timeline').dialog({
  autoOpen: false,
  width: 500,
  buttons: [
    {
      text: 'Ok',
      async click() {
        await deleteCard('timeline');
        $(this).dialog('close');
        loadpage('timeline');
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
$('#deleteTimelineCard').click((event) => {
  $('#dialog-delete-timeline').dialog('open');
  $('#btnTwo').focus();
  event.preventDefault();
});

restoreCharactersCard();
// restoreCategories('world');

restorePOV('#pov_id', 'characters');
