async function restoreNoteCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.notes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(key => {
        const result = document.getElementById(key);
        if (key === "image_card" && ele[key] !== '') {
          var cardbackgrond = document.getElementById("imageCardBackgournd");
          cardbackgrond.classList.add("imageCardBackgournd");
          cardbackgrond.children[0].style.backgroundImage =  `url(${ ele[key] })`;
          cardbackgrond.children[0].classList.add("cardImageDiv");
          result.setAttribute("src", ele[key]);
          result.classList.add("cardImage");
        } if (key === "content") {
          return document.getElementById("lista-tarefas").innerHTML = ele[key];
        } if (result) {
          return result.value = ele[key];
        }
      })
    }
  })
};

var elementsArray = document.querySelectorAll(".projectInputForm");

elementsArray.forEach(async function(elem) {
  const currentID = await getCurrentProjectID();
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  const positionInArray = await getCurrentCard();
  projectData.data.notes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("input", async () => {
        const field = elem.id
        db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.notes[positionInArray][field] = elem.value;
        });
      });
    }
  })
});

var selectItem = document.getElementById('lista-tarefas');

async function saveChecklistContent() {
  const list = document.querySelector('ol').innerHTML;
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  db.projects.where('id').equals(currentID).modify( (e) => {
    e.data.notes[positionInArray].content = list;
  });
}

function newTask() {
  const li = document.createElement('p');
  const newItem = document.getElementById('texto-tarefa').value;
  if (!newItem) {
    return alert("Digite uma terefa!")
  }
  const textItem = '• ' + newItem
  const ol = document.getElementById('lista-tarefas');
  li.innerText = textItem;
  ol.appendChild(li);
  saveChecklistContent()
  document.getElementById('texto-tarefa').value = '';
}

function clearAll() {
  selectItem.innerHTML = "";
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
  for (let i =0; i < atual.length - 1; i += 1) {
    let teste = atual[i].classList;
    if (teste.contains('selected')) {
      atual[i].parentNode.insertBefore(atual[i].nextSibling, proximo);
    }
  }
  saveChecklistContent();
}

function sendUp() {
  const atual = document.querySelectorAll('p');
  const proximo = document.querySelector('.selected');
  for (let i =1; i < atual.length; i += 1) {
    let teste = atual[i].classList;
    if (teste.contains('selected')) {
      atual[i].parentNode.insertBefore(proximo, atual[i].previousSibling);
    }
  }
  saveChecklistContent();
};

function removeSelected() {
  const liSecelt = document.querySelectorAll('.selected');
  for (let i = 0; i < liSecelt.length; i += 1) {
    selectItem.removeChild(liSecelt[i]);
  }
  saveChecklistContent();
}

function selectTask(event) {
  console.log('clicou');
  const element = event.target;
  const className = element.classList[0]; 
  if (className === "selected") {
    return element.classList.remove('selected');
  }
  const mouseClick = document.querySelectorAll('.selected');
  for (let i = 0; i < mouseClick.length; i += 1) {
    mouseClick[i].classList.remove('selected');
  }
  event.target.classList.add('selected');
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

var inputText = document.getElementById('texto-tarefa');

inputText.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    newTask()
  }
});

$( "#dialog-delete-note-list" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await deleteCard('notes');
        $( this ).dialog( "close" );
        loadpage('notas');
			}
		},
		{
			text: "Cancel",
      id: "btnTwo-delete-list-note",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
});
// Link to open the dialog
$( "#deleteNoteListCard" ).click(function( event ) {
	$( "#dialog-delete-note-list" ).dialog( "open" );
  $("#btnTwo-delete-list-note").focus();
	event.preventDefault();
});

restoreNoteCard();
