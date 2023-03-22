console.log("Chamou timeline!");
changeTabColor("timeline");

function validadeForm() {
  const dateField = document.getElementById("timelineDate").value
  return dateField !== "" ? true : false;
}

$( "#dialogTimeline" ).dialog({
autoOpen: false,
width: 600,
buttons: [
  {
    text: "Ok",
    id: "okBtn-timeline",
    disabled: false,
    click: async function() {
      const validade = validadeForm();
      if (validade) {
        await createNewTimeline();
        $( this ).dialog( "close" );
        document.getElementById("timelineName").value = "";
        document.getElementById("timelineDate").value = "";
        pageChange('#dinamic', 'pages/timeline/page.html', 'pages/timeline/script.js')
      } else {
        alert('Por favor, preencha a data!')
      }
    }
  },
  {
    text: "Cancel",
    click: function() {
      document.getElementById("timelineName").value = "";
      document.getElementById("timelineDate").value = "";
      $( this ).dialog( "close" );
    }
  }]
});
// Link to open the dialog
$( "#dialog-link-timeline" ).click(function( event ) {
  $( "#dialogTimeline" ).dialog( "open" );
  $( "#okBtn-timeline" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("timelineName").value = "";
    document.getElementById("timelineDate").value = "";
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

function handleTitle(type) {
  let result;
  switch(type) {
    case "characters-death":
      result = "🪦 Morre ";
      break;
    case "characters-birth":
      result = "✶ Nasce ";
      break;
    case "scene":
      result = "🎬 ";
      break;
    default:
      result = '';
  }
  return result;
}

function tableName(name) {
  let result;
  switch(name) {
    case "characters-death":
      result = "characters";
      break;
    case "characters-birth":
      result = "characters";
      break;
    case "scene":
      result = "scenes";
      break;
    case "historical-event":
      result = "world";
      break;
    default:
      result = '';
  }
  return result;
}

async function getElementTitle(type, elementID) {
  const table = tableName(type);
  if (table) {
    const project = await getCurrentProject();
    const element = project.data[table].map(function (e) { return e.id; }).indexOf(elementID);
    const resultName = project.data[table][element].title;
    const resultColor = project.data[table][element].color;
    return { 'name': resultName, 'color': resultColor };
  }
  return ''
}

async function getTimeline() {
  const project = await getCurrentProject();
  const tagColor = false;
  const resultSorted = sortByKey(project.data.timeline, 'date');
  resultSorted.forEach( async (ele) => {
    const dateConverted = convertDatePT_BR(ele.date);
    const symbolTitle = handleTitle(ele.elementType)
    const charName = await getElementTitle(ele.elementType, ele.elementID)
    $('#timelineMain').append(
      `
      <li>
        <div class="time" style="background: ${charName.color ? charName.color : '#2D333B'}; color: ${charName.color ? 'black' : ''}"> ${ dateConverted } | ${symbolTitle} ${charName.name}</div>
        <p>${ ele.content } </p>
      </li>
      `
    );
    setContentOpacity();
    setImageOpacity();
  })
};

async function getWorldCardsFiltred(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.world, 'title')
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

async function createNewTimeline() {
  const ID = await idManager('id_timeline')
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const timelineName = document.getElementById("timelineName");
  const timelineDate = document.getElementById("timelineDate");
  const data = {
    title: timelineName.value,
    elementType: '',
    elementID: '',
    content: '',
    date: timelineDate.value,
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.timeline.push(data) 
    }
  );  
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

setCustomTabs('timeline');
getTimeline();
validateNewCard("timelineName", "#okBtn-timeline");
validateNewCard("categoryName", "#okBtn-cat");
validateNewCard("categoryDelName", "#okBtn-delcat");
