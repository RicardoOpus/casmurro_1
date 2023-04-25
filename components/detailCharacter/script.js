/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
changeTabColor('personagens');

async function clearDateDeathBirth(type) {
  document.getElementById(type).value = '';
  const projectData = await getCurrentProject();
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  const idTimeline = projectData.data.characters[positionInArray][type];
  const positionInArrayTime = projectData.data.timeline.map((e) => e.id).indexOf(idTimeline);
  await db.projects.where('id').equals(currentID).modify((e) => {
    e.data.timeline.splice(positionInArrayTime, 1);
  });
  return db.projects.where('id').equals(currentID).modify((e) => {
    e.data.characters[positionInArray][type] = '';
  });
}

async function deleteRalation(ralation) {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  db.projects.where('id').equals(currentID).modify((e) => {
    e.data.characters[positionInArray].relations.splice(ralation, 1);
  });
  return pageChange('#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js');
}

function createRelations(relations, characters) {
  const linksDiv = document.getElementById('relationsList');
  linksDiv.innerHTML = '<fieldset><legend>Relacionamentos:</legend><div id=\'anchorRel\'></div></fieldset>';
  const insideDiv = document.getElementById('anchorRel');
  relations.forEach((relationElement, i) => {
    const char = characters.filter((ele) => ele.id === relationElement.character);
    const anchor = document.createElement('div');
    anchor.innerHTML = `<p id="${i}"><span class="xlink" style='cursor: pointer' onclick="deleteRalation(${i})">&times;</span> <button style="border-radius: 5px;background-color: ${char[0].color}"> ${char[0].title} </button> ${relationElement.relation}</p>`;
    insideDiv.appendChild(anchor);
  });
}

async function restoreCharactersCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.characters.forEach((ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach((key) => {
        const result = document.getElementById(key);
        if (key === 'date_birth' && ele[key] !== '') {
          const resultDate = projectData.data.timeline
            .filter((timelineElement) => timelineElement.id === ele[key]);
          result.value = resultDate[0].date;
          return result.value;
        } if (key === 'date_death' && ele[key] !== '') {
          const resultDate = projectData.data.timeline
            .filter((timelineElement) => timelineElement.id === ele[key]);
          result.value = resultDate[0].date;
          return result.value;
        } if (key === 'image_card' && ele[key] !== '') {
          result.setAttribute('src', ele[key]);
        } if (key === 'checkboxExtra_1') {
          const divExtra = document.getElementById('info_extra_1');
          if (ele[key]) {
            const checkExtra = document.getElementById('checkboxExtra_1');
            divExtra.removeAttribute('style');
            checkExtra.checked = true;
          }
        } if (key === 'checkboxExtra_2') {
          const divExtra = document.getElementById('info_extra_2');
          if (ele[key]) {
            const checkExtra = document.getElementById('checkboxExtra_2');
            divExtra.removeAttribute('style');
            checkExtra.checked = true;
          }
        } if (key === 'checkboxExtra_3') {
          const divExtra = document.getElementById('info_extra_3');
          if (ele[key]) {
            const checkExtra = document.getElementById('checkboxExtra_3');
            divExtra.removeAttribute('style');
            checkExtra.checked = true;
          }
        } if (key === 'chkBirth') {
          const divExtra = document.getElementById('dateBirthDiv');
          if (ele[key]) {
            const checkExtra = document.getElementById('checkbox-date-birth');
            divExtra.removeAttribute('style');
            checkExtra.checked = true;
          }
        } if (key === 'chkDeath') {
          const divExtra = document.getElementById('dateDeathDiv');
          if (ele[key]) {
            const checkExtra = document.getElementById('checkbox-date-death');
            divExtra.removeAttribute('style');
            checkExtra.checked = true;
          }
        } if (key === 'checkboxFullName') {
          const divExtra = document.getElementById('fullNameDiv');
          if (ele[key]) {
            const checkExtra = document.getElementById('checkboxFullName');
            divExtra.removeAttribute('style');
            checkExtra.checked = true;
          }
        } if (key === 'relations' && ele[key].length > 0) {
          return createRelations(ele[key], projectData.data.characters);
        } if (result) {
          result.value = ele[key];
          return result.value;
        }
        return null;
      });
      resumeHeight(
        'content',
        'extra_1',
        'extra_1_1',
        'extra_2',
        'extra_2_1',
        'extra_2_2',
        'extra_3',
        'extra_3_1',
      );
    }
  });
  previousAndNextCard(projectData.data.characters, 'characters', 'detailCharacter');
}

function updateValues() {
  const elementsArray = document.querySelectorAll('.projectInputForm');
  elementsArray.forEach(async (elem) => {
    const currentID = await getCurrentProjectID();
    const currentCardID = await getCurrentCardID();
    const projectData = await getCurrentProject();
    const positionInArray = await getCurrentCard();
    projectData.data.characters.forEach((ele) => {
      if (ele.id === currentCardID) {
        elem.addEventListener('change', async () => {
          lastEditListModify('characters', currentCardID);
          const field = elem.id;
          if (elem.id === 'date_birth') {
            const checkIfisNew = await checkTimelineNewDate(ele.id, 'characters-birth', 'elementID');
            if (checkIfisNew) {
              const projectDataActual = await getCurrentProject();
              const actualIDdateBirth = projectDataActual
                .data.characters[positionInArray].date_birth;
              const positionInArrayTime = projectDataActual.data.timeline
                .map((e) => e.id).indexOf(actualIDdateBirth);
              return db.projects.where('id').equals(currentID).modify((e) => {
                e.data.timeline[positionInArrayTime].date = elem.value;
              });
            }
            const timelineID = await NewTimelineCharacter(elem.value, ele.id, 'characters-birth');
            return db.projects.where('id').equals(currentID).modify((e) => {
              e.data.characters[positionInArray][field] = timelineID;
            });
          } if (elem.id === 'date_death') {
            const checkIfisNew = await checkTimelineNewDate(ele.id, 'characters-death', 'elementID');
            if (checkIfisNew) {
              const projectDataActual = await getCurrentProject();
              const actualIDdateDeath = projectDataActual
                .data.characters[positionInArray].date_death;
              const positionInArrayTime = projectDataActual.data.timeline
                .map((e) => e.id).indexOf(actualIDdateDeath);
              return db.projects.where('id').equals(currentID).modify((e) => {
                e.data.timeline[positionInArrayTime].date = elem.value;
              });
            }
            const timelineID = await NewTimelineCharacter(elem.value, ele.id, 'characters-death');
            return db.projects.where('id').equals(currentID).modify((e) => {
              e.data.characters[positionInArray][field] = timelineID;
            });
          }
          db.projects.where('id').equals(currentID).modify((e) => {
            e.data.characters[positionInArray][field] = elem.value;
          });
          return updateLastEdit(currentID);
        });
      }
    });
  });
}

$('#dialog-delete-char').dialog({
  autoOpen: false,
  width: 500,
  buttons: [
    {
      text: 'Ok',
      id: 'btnDelChar',
      async click() {
        await clearDateDeathBirth('date_birth');
        await clearDateDeathBirth('date_death');
        await deleteCard('characters');
        $(this).dialog('close');
        loadpage('personagens');
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
$('#deleteCharCard').click((event) => {
  $('#dialog-delete-char').dialog('open');
  $('#btnTwo').focus();
  event.preventDefault();
});

document.getElementById('btnSaveWall').disabled = true;
document.getElementById('my-image').addEventListener('input', () => {
  document.getElementById('btnSaveWall').disabled = false;
});

restoreCharactersCard();
restoreCategories('characters');
restoreGenders();
updateValues();

function dateBirthchkHandle() {
  const dateBirthchk = document.getElementById('checkbox-date-birth');
  const fieldDateBirth = document.getElementById('dateBirthDiv');
  dateBirthchk.addEventListener('change', async function () {
    const currentID = await getCurrentProjectID();
    const currentCardID = await getCurrentCardID();
    const positionInArray = await getCurrentCard();
    if (this.checked) {
      fieldDateBirth.style.display = 'block';
      fieldDateBirth.scrollIntoView({ behavior: 'smooth' });
      db.projects.where('id').equals(currentID).modify((e) => {
        e.data.characters[positionInArray].chkBirth = true;
      });
      const timelineID = await NewTimelineCharacter('2000-01-01', currentCardID, 'characters-birth');
      db.projects.where('id').equals(currentID).modify((e) => {
        e.data.characters[positionInArray].date_birth = timelineID;
      });
    } else {
      clearDateDeathBirth('date_birth');
      fieldDateBirth.style.display = 'none';
      db.projects.where('id').equals(currentID).modify((e) => {
        e.data.characters[positionInArray].chkBirth = false;
      });
    }
  });
}
dateBirthchkHandle();

function dateDeathchkHandle() {
  const dateDeathchk = document.getElementById('checkbox-date-death');
  const fieldDateDeath = document.getElementById('dateDeathDiv');
  dateDeathchk.addEventListener('change', async function () {
    const currentID = await getCurrentProjectID();
    const positionInArray = await getCurrentCard();
    if (this.checked) {
      fieldDateDeath.style.display = 'block';
      fieldDateDeath.scrollIntoView({ behavior: 'smooth' });
      db.projects.where('id').equals(currentID).modify((e) => {
        e.data.characters[positionInArray].chkDeath = true;
      });
    } else {
      clearDateDeathBirth('date_death');
      fieldDateDeath.style.display = 'none';
      db.projects.where('id').equals(currentID).modify((e) => {
        e.data.characters[positionInArray].chkDeath = false;
      });
    }
  });
}
dateDeathchkHandle(params);

function createCheckboxChangeHandler(checkbox, divInfo, extra1, extra2, extra3) {
  return async function () {
    const currentID = await getCurrentProjectID();
    const positionInArray = await getCurrentCard();
    if (this.checked) {
      // eslint-disable-next-line no-param-reassign
      divInfo.style.display = 'block';
      divInfo.scrollIntoView({ behavior: 'smooth' });
      resumeHeight(extra1, extra2, extra3);
      db.projects.where('id').equals(currentID).modify((e) => {
        e.data.characters[positionInArray][checkbox.id] = true;
      });
    } else {
      // eslint-disable-next-line no-param-reassign
      divInfo.style.display = 'none';
      db.projects.where('id').equals(currentID).modify((e) => {
        e.data.characters[positionInArray][checkbox.id] = false;
      });
    }
  };
}

function showHideOptions() {
  const checkboxFullName = document.getElementById('checkboxFullName');
  const divFullName = document.getElementById('fullNameDiv');
  checkboxFullName.addEventListener('change', createCheckboxChangeHandler(checkboxFullName, divFullName, 'nameFull'));

  const checkboxExtra1 = document.getElementById('checkboxExtra_1');
  const divExtraInfos1 = document.getElementById('info_extra_1');
  checkboxExtra1.addEventListener('change', createCheckboxChangeHandler(checkboxExtra1, divExtraInfos1, 'extra_1', 'extra_1_1'));

  const checkboxExtra2 = document.getElementById('checkboxExtra_2');
  const divExtraInfos2 = document.getElementById('info_extra_2');
  checkboxExtra2.addEventListener('change', createCheckboxChangeHandler(checkboxExtra2, divExtraInfos2, 'extra_2', 'extra_2_1', 'extra_2_2'));

  const checkboxExtra3 = document.getElementById('checkboxExtra_3');
  const divExtraInfos3 = document.getElementById('info_extra_3');
  checkboxExtra3.addEventListener('change', createCheckboxChangeHandler(checkboxExtra3, divExtraInfos3, 'extra_3', 'extra_3_1'));

  const addRelationBtn = document.querySelector('#addRelation');
  const modalRelations = document.getElementById('myModalCharacterRelations');
  const span = document.getElementsByClassName('close')[0];
  addRelationBtn.onclick = function () {
    modalRelations.style.display = 'block';
  };
  span.onclick = function () {
    document.getElementById('relationListSelect').value = '';
    document.getElementById('relationDescription').value = '';
    modalRelations.style.display = 'none';
  };
}
showHideOptions();

async function restoreCharRelation(id) {
  const currentCardID = await getCurrentCardID();
  const project = await getCurrentProject();

  const itensList = project.data.characters;
  $(id).empty();
  $(id).append('<option disabled>-- selecione --<option>');
  $.each(itensList, (i, value) => {
    if (value.id !== currentCardID) {
      const option = $('<option></option>').val(value.id).html(value.title);
      $(id).append(option);
    }
  });
}

restoreCharRelation('#relationListSelect');

async function saveRelation() {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  const character = document.getElementById('relationListSelect').value;
  const relation = document.getElementById('relationDescription').value;
  if (!character || !relation) {
    // eslint-disable-next-line no-alert
    return alert('Favor preenchar todos os campos!');
  }
  const obj = { character: Number(character), relation };
  await db.projects.where('id').equals(currentID).modify((e) => {
    e.data.characters[positionInArray].relations.push(obj);
  });
  modalRelations.style.display = 'none';
  document.getElementById('relationListSelect').value = '';
  document.getElementById('relationDescription').value = '';
  return pageChange('#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js');
}
