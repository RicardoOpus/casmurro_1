/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
changeTabColor('notas');

async function restoreNoteCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.notes.forEach((ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach((key) => {
        const result = document.getElementById(key);
        if (key === 'image_card' && ele[key] !== '') {
          const cardbackgrond = document.getElementById('imageCardBackgournd');
          cardbackgrond.classList.add('imageCardBackgournd');
          cardbackgrond.children[0].style.backgroundImage = `url(${ele[key]})`;
          cardbackgrond.children[0].classList.add('cardImageDiv');
          result.setAttribute('src', ele[key]);
          result.classList.add('cardImage');
        } if (key === 'content') {
          document.getElementById('lista-tarefas').innerHTML = ele[key];
          return null;
        } if (result) {
          result.value = ele[key];
          return null;
        }
        return null;
      });
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
    projectData.data.notes.forEach((ele) => {
      if (ele.id === currentCardID) {
        elem.addEventListener('input', async () => {
          await lastEditListModify('notes', currentCardID);
          const field = elem.id;
          await db.projects.where('id').equals(currentID).modify((e) => {
            e.data.notes[positionInArray][field] = elem.value;
          });
          updateLastEdit(currentID);
        });
      }
    });
  });
}

saveValues();

// eslint-disable-next-line prefer-const
let selectItem = document.getElementById('lista-tarefas');

async function saveChecklistContent() {
  const currentCardID = await getCurrentCardID();
  const list = document.querySelector('ol').innerHTML;
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  await db.projects.where('id').equals(currentID).modify((e) => {
    e.data.notes[positionInArray].content = list;
  });
  await lastEditListModify('notes', currentCardID);
  updateLastEdit(currentID);
}

function newTask() {
  const li = document.createElement('p');
  const newItem = document.getElementById('texto-tarefa').value;
  if (!newItem) {
    return alert('Digite uma terefa!');
  }
  const textItem = `• ${newItem}`;
  const ol = document.getElementById('lista-tarefas');
  li.innerText = textItem;
  ol.appendChild(li);
  saveChecklistContent();
  document.getElementById('texto-tarefa').value = '';
  return null;
}

function clearAll() {
  selectItem.innerHTML = '';
  saveChecklistContent();
}

function clearAllDone() {
  const liSecelt = document.querySelectorAll('.completed');
  for (let i = 0; i < liSecelt.length; i += 1) {
    selectItem.removeChild(liSecelt[i]);
  }
  saveChecklistContent();
}

function sendDown() {
  const atual = document.querySelectorAll('p');
  const proximo = document.querySelector('.selected');
  for (let i = 0; i < atual.length - 1; i += 1) {
    const teste = atual[i].classList;
    if (teste.contains('selected')) {
      atual[i].parentNode.insertBefore(atual[i].nextSibling, proximo);
    }
  }
  saveChecklistContent();
}

function sendUp() {
  const atual = document.querySelectorAll('p');
  const proximo = document.querySelector('.selected');
  for (let i = 1; i < atual.length; i += 1) {
    const teste = atual[i].classList;
    if (teste.contains('selected')) {
      atual[i].parentNode.insertBefore(proximo, atual[i].previousSibling);
    }
  }
  saveChecklistContent();
}

function removeSelected() {
  const liSecelt = document.querySelectorAll('.selected');
  for (let i = 0; i < liSecelt.length; i += 1) {
    selectItem.removeChild(liSecelt[i]);
  }
  saveChecklistContent();
}

function selectTask(event) {
  const element = event.target;
  const className = element.classList[0];
  if (className === 'selected') {
    element.classList.remove('selected');
    return saveChecklistContent();
  }
  const mouseClick = document.querySelectorAll('.selected');
  for (let i = 0; i < mouseClick.length; i += 1) {
    mouseClick[i].classList.remove('selected');
  }
  event.target.classList.add('selected');
  return saveChecklistContent();
}

function taskDone(event2) {
  const verify = event2.target.classList.contains('completed');
  if (verify === true) {
    event2.target.classList.remove('completed');
  } else {
    event2.target.classList.add('completed');
  }
  saveChecklistContent();
}

selectItem.addEventListener('click', selectTask);
selectItem.addEventListener('dblclick', taskDone);

const inputText = document.getElementById('texto-tarefa');

inputText.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    newTask();
  }
});

$('#dialog-delete-note-list').dialog({
  autoOpen: false,
  width: 500,
  buttons: [
    {
      text: 'Ok',
      async click() {
        await deleteCard('notes');
        $(this).dialog('close');
        loadpage('notas');
      },
    },
    {
      text: 'Cancel',
      id: 'btnTwo-delete-list-note',
      click() {
        $(this).dialog('close');
      },
    },
  ],
});
// Link to open the dialog
$('#deleteNoteListCard').click((event) => {
  $('#dialog-delete-note-list').dialog('open');
  $('#btnTwo-delete-list-note').focus();
  event.preventDefault();
});

restoreNoteCard();
