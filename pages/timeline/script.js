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

$( "#dialog_new_timelineCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-cat",
      disabled: false,
      click: async function() {
        var filterChar = document.getElementById("catCharacterName");
        await addNewCategory('timeline', filterChar.value);
        $( this ).dialog( "close" );
        document.getElementById("catCharacterName").value = "";
        pageChange('#dinamic', 'pages/timeline/page.html', 'pages/timeline/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("catCharacterName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Category
$( "#dialog-link-character-filter" ).click(function( event ) {
  $( "#dialog_new_timelineCategory" ).dialog( "open" );
  $( "#okBtn-cat" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("catCharacterName").value = "";
    })
  restorePOV('#catCharacterName', 'characters');
  event.preventDefault();
});

$( "#dialog_delete_timelineCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-delcatTimeline",
      disabled: false,
      click: async function() {
        var catDel = document.getElementById("categoryDeltimelineName");
        await removeCategory('timeline', catDel.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryDeltimelineName").value = "";
        pageChange('#dinamic', 'pages/timeline/page.html', 'pages/timeline/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("categoryDeltimelineName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Delete Category
$( "#dialog-link-delcategory" ).click(function( event ) {
  $( "#dialog_delete_timelineCategory" ).dialog( "open" );
  $( "#okBtn-delcatTimeline" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryDeltimelineName").value = "";
    })
    restoreDelPovTab('timeline', '#categoryDeltimelineName');
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
    case "historical-event":
      result = "🗓 ";
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
  return '';
}

function removeDuplicateIds() {
  const allIds = document.querySelectorAll('[id]');
  const seenIds = {};
  allIds.forEach((el) => {
    const id = el.getAttribute('id');
    if (seenIds[id]) {
      el.parentNode.removeChild(el);
    } else {
      seenIds[id] = true;
    }
  });
}

async function getTimeline() {
  const project = await getCurrentProject();
  const resultSorted = sortByDate(project.data.timeline);
  let prevDate = null;
  let prevLi = null;
  for (let i = 0; i < resultSorted.length; i++) {
    const ele = resultSorted[i];
    const dateConverted = convertDatePT_BR(ele.date);
    const symbolTitle = handleTitle(ele.elementType);
    const charName = await getElementTitle(ele.elementType, ele.elementID);
    if (dateConverted === prevDate) {
      prevLi.find('p').append(`
      <a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `setCurrentCard('timeline', ${ ele.id }), pageChange('#project-list', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
        <div id="${ele.id}" class="time" style="background: linear-gradient(to right, ${charName.color ? charName.color : '#2D333B'} 0%, #2D333B 85%); color: ${charName.color ? 'black' : ''}">${symbolTitle} ${ele.title? ele.title : charName.name}</div>
        </a>
        <p><a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `setCurrentCard('timeline', ${ ele.id }), pageChange('#project-list', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ ele.content }</a></p>
      `);
    } else {
      prevDate = dateConverted;
      const li = $(`
      <li>
        <div class="timeline-section">
          <a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `setCurrentCard('timeline', ${ ele.id }), pageChange('#project-list', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
            <div class="timeDate">${ dateConverted }</div>
            <div class="time" style="background: linear-gradient(to right, ${charName.color ? charName.color : '#2D333B'} 0%, #2D333B 85%); color: ${charName.color ? 'black' : ''}">${symbolTitle} ${ele.title? ele.title : charName.name}</div>
            </a>
            <p><a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `setCurrentCard('timeline', ${ ele.id }), pageChange('#project-list', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ ele.content }</a></p>
        </div>
      </li>
      `);
      prevLi = li;
      $('#timelineMain').append(li);
    }
  }
  removeDuplicateIds()
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

setCustomTimelineTabs('timeline');
getTimeline();
validateNewCard("timelineName", "#okBtn-timeline");
validateNewCard("catCharacterName", "#okBtn-cat");
validateNewCard("categoryDeltimelineName", "#okBtn-delcatTimeline");
