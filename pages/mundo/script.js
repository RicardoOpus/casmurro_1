console.log("Chamou Mundo!")
changeTabColor("mundo");

$( "#dialogWorld" ).dialog({
autoOpen: false,
width: 600,
buttons: [
  {
    text: "Ok",
    id: "okBtn-world",
    disabled: false,
    click: async function() {
      await createNewWorld();
      $( this ).dialog( "close" );
      document.getElementById("worldName").value = "";
      pageChange('#dinamic', 'pages/mundo/page.html', 'pages/mundo/script.js')
    }
  },
  {
    text: "Cancel",
    click: function() {
      document.getElementById("worldName").value = "";
      $( this ).dialog( "close" );
    }
  }]
});
// Link to open the dialog
$( "#dialog-link-world" ).click(function( event ) {
  $( "#dialogWorld" ).dialog( "open" );
  $( "#okBtn-world" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("worldName").value = "";
  })
  event.preventDefault();
});

$( "#dialog_new_worldCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-cat",
      disabled: false,
      click: async function() {
        var cat = document.getElementById("categoryName");
        await addNewCategory('world', cat.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryName").value = "";
        pageChange('#dinamic', 'pages/mundo/page.html', 'pages/mundo/script.js')
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
$( "#dialog-link-category" ).click(function( event ) {
  $( "#dialog_new_worldCategory" ).dialog( "open" );
  $( "#okBtn-cat" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryName").value = "";
    })
  event.preventDefault();
});

$( "#dialog_delete_worldCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-delcat",
      disabled: false,
      click: async function() {
        var catDel = document.getElementById("categoryDelName");
        await removeCategory('world', catDel.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryDelName").value = "";
        pageChange('#dinamic', 'pages/mundo/page.html', 'pages/mundo/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("categoryDelName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Delete Category
$( "#dialog-link-delcategory" ).click(function( event ) {
  $( "#dialog_delete_worldCategory" ).dialog( "open" );
  $( "#okBtn-delcat" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryDelName").value = "";
    })
  restoreDelCategories('world', '#categoryDelName');
  event.preventDefault();
});

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getWorldCardsFiltred(filterCategory);
}

async function getWorldCards() {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.world, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  }
  resultSorted.forEach( (ele) => {
    $('#project-list').append(
      `
      <ul class="worldList">
        <li class="worldItens" id='${ ele.id }'>
        <a onclick="pageChange('#project-list', 'components/world/page.html', 'components/world/script.js')">
          <div class="worldName" onclick="setCurrentCard('world', ${ ele.id })">
            <div class="contentListWorld">
              <p class="wordlTitle">${ ele.title }</p>
              <hr class="cardLineTop">
              <span> ${ ele.category } </span>
              <div class="worldCardDivider">
                <div>
                  <p class="it">${ ele.content }</p>
                </div>
                <div>
                  <img src="${ !ele.image_card ? '' : ele.image_card }" class="worldListImage esse"> 
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
  const resultSorted = sortByKey(project.data.world, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  };
  resultSorted.forEach( (ele) => {
    if (ele.category === filter) {
      $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens">
          <a onclick="pageChange('#project-list', 'components/world/page.html', 'components/world/script.js')">
            <div class="worldName paper" onclick="setCurrentCard('world', ${ ele.id })">
              <div class="contentListWorld">
                <p class="wordlTitle">${ ele.title }</p>
                <hr class="cardLineTop">
                <span> ${ ele.category } </span>
                <div class="worldCardDivider">
                  <div>
                    <p class="it">${ ele.content }</p>
                  </div>
                  <div>
                    <img src="${ !ele.image_card ? '' : ele.image_card }" class="worldListImage esse"> 
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

async function createNewWorld() {
  const ID = await idManager('id_world')
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const worldName = document.getElementById("worldName");
  const data = {
    title: worldName.value,
    category: '',
    image_card: '',
    content: '',
    date: '',
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.world.push(data) 
    }
  ); 
  await updateLastEditList('world', ID)
  return db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
};

setCustomTabs('world');
getWorldCards();
validateNewCard("worldName", "#okBtn-world");
validateNewCard("categoryName", "#okBtn-cat");
validateNewCard("categoryDelName", "#okBtn-delcat");
