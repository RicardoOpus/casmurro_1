console.log("SCRIPT NOTAS");
changeTabColor("notas");

function categoryReservedName(name) {
  return name === "Listas" ? true : false 
}

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
    image_card: '',
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.notes.push(data) 
    }
  );
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

async function createNewNoteList() {
  const ID = await idManager('id_notes')
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; 
  const year = currentDate.getFullYear();
  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year.toString()}`;
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const data = {
    title: `Nova Lista (${formattedDate})`,
    content: '',
    category: 'Listas',
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.notes.push(data) 
    }
  );
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return pageChange('#dinamic', 'pages/notas/page.html', 'pages/notas/script.js')
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

$( "#dialog_new_noteCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-cat-note",
      disabled: false,
      click: async function() {
        var cat = document.getElementById("categoryNoteName");
        const check = categoryReservedName(cat.value);
        if (check) {
          return alert('Categoria Listas já existe! Escolha outro nome.')
        }
        await addNewCategory('notes', cat.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryNoteName").value = "";
        pageChange('#dinamic', 'pages/notas/page.html', 'pages/notas/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("categoryNoteName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Category
$( "#dialog-link-category-note" ).click(function( event ) {
  $( "#dialog_new_noteCategory" ).dialog( "open" );
  $( "#okBtn-cat-note" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryNoteName").value = "";
    })
  event.preventDefault();
});
validateNewCard("categoryNoteName", "#okBtn-cat-note");

$( "#dialog_delete_noteCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-delcat-note",
      disabled: false,
      click: async function() {
        var catDel = document.getElementById("categoryDelNoteName");
        await removeCategory('notes', catDel.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryDelNoteName").value = "";
        pageChange('#dinamic', 'pages/notas/page.html', 'pages/notas/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("categoryDelNoteName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Delete Category
$( "#dialog-link-delcategory-note" ).click(function( event ) {
  $( "#dialog_delete_noteCategory" ).dialog( "open" );
  $( "#okBtn-delcat-note" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryDelNoteName").value = "";
    })
  restoreDelCategories('notes', '#categoryDelNoteName');
  event.preventDefault();
});
validateNewCard("categoryDelNoteName", "#okBtn-delcat-note");

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getNotesCardsFilter(filterCategory);
}

function removeListClass() {
  const itens = document.querySelectorAll(".selected");
  for (let i = 0; i < itens.length; i++) {
    itens[i].classList.remove('selected');
  }
};

async function getNotesCards() {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.notes, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  }
  resultSorted.forEach( (ele) => {
    if (ele.category === "Listas") {
      return $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens">
          <a onclick="pageChange('#project-list', 'components/detailList/page.html', 'components/detailList/script.js')">
            <div class="worldName" onclick="setCurrentCard('notes', ${ ele.id })">
              <div class="contentListWorld">
                <p class="wordlTitle">${ ele.title }</p>
                <hr class="cardLineTop">
                <span> ${ ele.category } </span>
                <div class="worldCardDivider">
                  <div>
                    <div class="it">${ ele.content }</div>
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
    }
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
    removeListClass();
  })
};

async function getNotesCardsFilter(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.notes, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  };
  resultSorted.forEach( (ele) => {
    if (ele.category === filter) {
      if (ele.category === "Listas") {
        return $('#project-list').append(
          `
          <ul class="worldList">
            <li class="worldItens">
            <a onclick="pageChange('#project-list', 'components/detailList/page.html', 'components/detailList/script.js')">
              <div class="worldName" onclick="setCurrentCard('notes', ${ ele.id })">
                <div class="contentListWorld">
                  <p class="wordlTitle">${ ele.title }</p>
                  <hr class="cardLineTop">
                  <span> ${ ele.category } </span>
                  <div class="worldCardDivider">
                    <div>
                      <div class="it">${ ele.content }</div>
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
      }
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
    }
    setContentOpacity();
    setImageOpacity();
    removeListClass();
  })
};

getNotesCards();
setCustomTabs('notes');
