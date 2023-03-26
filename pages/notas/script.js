console.log("SCRIPT NOTAS");
changeTabColor("notas");

async function createNewNote() {
  const ID = await idManager('id_notes')
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const noteName = document.getElementById("noteName");
  const data = {
    title: noteName.value,
    content: '',
    category: '',
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.notes.push(data) 
    }
  );
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

$( "#dialogNotes" ).dialog({
  autoOpen: false,
  width: 600,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-notes",
      disabled: false,
      click: async function() {
        await createNewNote();
        $( this ).dialog( "close" );
        document.getElementById("noteName").value = "";
        pageChange('#dinamic', 'pages/notas/page.html', 'pages/notas/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("noteName").value = "";
        $( this ).dialog( "close" );
      }
    }]
  });
  // Link to open the dialog
  $( "#dialog-link-note" ).click(function( event ) {
    $( "#dialogNotes" ).dialog( "open" );
    $( "#okBtn-notes" ).addClass( "ui-button-disabled ui-state-disabled" );
    $( ".ui-icon-closethick" ).click(function( event ) {
      document.getElementById("noteName").value = "";
    })
    event.preventDefault();
  });

validateNewCard("noteName", "#okBtn-notes");

async function getNotesCards() {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.notes, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  }
  resultSorted.forEach( (ele) => {
    $('#project-list').append(
      `
      <ul class="worldList">
        <li class="worldItens">
        <a onclick="pageChange('#project-list', 'components/detailNote/page.html', 'components/detailNote/script.js')">
          <div class="worldName" onclick="setCurrentCard('notes', ${ ele.id })">
            <div class="contentListWorld">
              <p class="wordlTitle">${ ele.title }</p>
              <hr class="cardLineTop">
              <span> ${ ele.category } </span>
              <div class="worldCardDivider">
                <div>
                  <p class="it">${ ele.content }</p>
                </div>
                <div>
                  <img src="${ !ele.image_card ? '' : ele.image_card }" class="worldListImage"> 
                </div>
              </div>
            </div>
          </div>
        </a>
        </li>
      </ul>
      `
    );
    setContentOpacity();
    setImageOpacity();
  })
};

getNotesCards();