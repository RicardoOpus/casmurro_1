console.log("Chamou Personagens!");
changeTabColor("personagens");

$( "#dialogCharacter" ).dialog({
autoOpen: false,
width: 600,
buttons: [
  {
    text: "Ok",
    id: "okBtn-character",
    disabled: false,
    click: async function() {
      await createNewCharacter();
      $( this ).dialog( "close" );
      document.getElementById("characterName").value = "";
      pageChange('#dinamic', 'pages/personagens/page.html', 'pages/personagens/script.js')
    }
  },
  {
    text: "Cancel",
    click: function() {
      document.getElementById("characterName").value = "";
      $( this ).dialog( "close" );
    }
  }]
});
// Link to open the dialog
$( "#dialog-link-character" ).click(function( event ) {
  $( "#dialogCharacter" ).dialog( "open" );
  $( "#okBtn-character" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("characterName").value = "";
  })
  event.preventDefault();
});

$( "#dialog_new_characterCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-cat",
      disabled: false,
      click: async function() {
        const cat = document.getElementById("categoryName");
        await addNewCategory('characters', cat.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryName").value = "";
        pageChange('#dinamic', 'pages/personagens/page.html', 'pages/personagens/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("categoryName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Category
$( "#dialog-link-category-char" ).click(function( event ) {
  $( "#dialog_new_characterCategory" ).dialog( "open" );
  $( "#okBtn-cat" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryName").value = "";
    })
  event.preventDefault();
});

$( "#dialog_delete_characterCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-delcat",
      disabled: false,
      click: async function() {
        const catDel = document.getElementById("categoryDelName-char");
        await removeCategory('characters', catDel.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryDelName-char").value = "";
        pageChange('#dinamic', 'pages/personagens/page.html', 'pages/personagens/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("categoryDelName-char").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Delete Category
$( "#dialog-link-delcategory-char" ).click(function( event ) {
  $( "#dialog_delete_characterCategory" ).dialog( "open" );
  $( "#okBtn-delcat" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryDelName-char").value = "";
    })
  restoreDelCategories('characters', '#categoryDelName-char');
  event.preventDefault();
});

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getWorldCardsFiltred(filterCategory);
}

async function getCharactersCards() {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.characters, 'title')
  resultSorted.forEach( (ele) => {
    $('#project-list').append(
      `
      <ul class="worldList">
        <li class="worldItens">
        <a onclick="pageChange('#project-list', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js')">
          <div class="worldName" onclick="setCurrentCard('characters', ${ ele.id })">
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

async function getWorldCardsFiltred(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.characters, 'title')
  resultSorted.forEach( (ele) => {
    if (ele.category === filter) {
      $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens">
          <a onclick="pageChange('#project-list', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js')">
            <div class="worldName paper" onclick="setCurrentCard('characters', ${ ele.id })">
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
    } else {
      null
    }
    setContentOpacity();
    setImageOpacity();
  })
};

async function createNewCharacter() {
  const ID = await idManager('id_characters')
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const characterName = document.getElementById("characterName");
  const data = {
    title: characterName.value,
    category: '',
    image_card: '',
    content: '',
    date_birth: '',
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.characters.push(data) 
    }
  );  
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

setCustomTabs('characters');
getCharactersCards();
validateNewCard("characterName", "#okBtn-character");
validateNewCard("categoryName", "#okBtn-cat");
validateNewCard("categoryDelName-char", "#okBtn-delcat");
