console.log("Chamou timeline!");
changeTabColor("timeline");

function validadeForm() {
  const dateField = document.getElementById("timelineDate").value
  return dateField !== "" ? true : false;
}

function showElapsedtime() {
  const divtarget = document.getElementById('elipsedTimeResult');
  divtarget.innerHTML = '';
  const date1 = document.getElementById('date1_ElapsedTime').value;
  const date2 = document.getElementById('date2_ElapsedTime').value;
  const element = document.createElement('p');
  const result = calculateTimeElapsed(date1, date2);
  element.innerText = `Passaram-se ${result.years} anos, ${result.months} meses e ${result.days} dias`
  divtarget.appendChild(element);
};

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
      id: "okBtn-cat-time",
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
  $( "#okBtn-cat-time" ).addClass( "ui-button-disabled ui-state-disabled" );
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
  geTimelineFiltred(filterCategory);
}

$( "#elapsedTime" ).dialog({
  autoOpen: false,
  width: 600,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-elapsedTime",
      disabled: false,
      click: async function() {
        const validade = validadeForm();
        if (true) {
          showElapsedtime();
          document.getElementById("timelineName").value = "";
          document.getElementById("timelineDate").value = "";
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
  // Link to open the dialog Elapsedtime
  $( "#dialog-link-elapsedTime" ).click(function( event ) {
    $( "#elapsedTime" ).dialog( "open" );
    $( "#okBtn-timeline" ).addClass( "ui-button-disabled ui-state-disabled" );
    $( ".ui-icon-closethick" ).click(function( event ) {
      document.getElementById("timelineName").value = "";
      document.getElementById("timelineDate").value = "";
    })
    restoreTimelineDates('#date1_ElapsedTime', 'timeline');
    restoreTimelineDates('#date2_ElapsedTime', 'timeline')
    event.preventDefault();
  });

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

function getCharColor(id, characters) {
  if (id) {
    const char = characters.filter((ele) => ele.id === id);
    return char[0].color;
  }
  return null 
}

function getColor(charName, selectedCharColor) {
  if (charName) {
    return charName.color
  } else if (selectedCharColor) {
    return selectedCharColor
  } else {
    return '#2D333B';
  }
};

async function getTimeline() {
  const project = await getCurrentProject();
  const resultSorted = sortByDate(project.data.timeline);
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  }
  let prevDate = null;
  let prevLi = null;
  for (let i = 0; i < resultSorted.length; i++) {
    const ele = resultSorted[i];
    const dateConverted = convertDatePTBR(ele.date);
    const symbolTitle = handleTitle(ele.elementType);
    const identfyType =  ele.elementID || ele.historicID || ele.sceneID;
    const charName = await getElementTitle(ele.elementType, identfyType);
    const selectedCharColor = getCharColor(Number(ele.pov_id), project.data.characters);
    if (dateConverted === prevDate) {
      prevLi.find('p').append(`
      <a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `loadpageOnclick('timeline', ${ ele.id }, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
        <div id="${ele.id}" class="time" style="background: linear-gradient(to right, ${ getColor(charName, selectedCharColor) } 0%, #2D333B 85%); color: ${charName.color || selectedCharColor ? 'black' : ''}">${symbolTitle} ${ele.title? ele.title : charName.name}</div>
        </a>
        <p><a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `loadpageOnclick('timeline', ${ ele.id }, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ ele.content }</a></p>
      `);
    } else {
      prevDate = dateConverted;
      const li = $(`
      <li>
        <div class="timeline-section" id='${ ele.id }'>
          <a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `loadpageOnclick('timeline', ${ ele.id }, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
            <div class="timeDate">${ dateConverted }</div>
            <div class="time" style="background: linear-gradient(to right, ${getColor(charName, selectedCharColor)} 0%, #2D333B 85%); color: ${charName.color || selectedCharColor ? 'black' : ''}">${symbolTitle} ${ele.title? ele.title : charName.name}</div>
            </a>
            <p><a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `loadpageOnclick('timeline', ${ ele.id }, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ ele.content }</a></p>
        </div>
      </li>
      `);
      prevLi = li;
      $('#timelineMain').append(li);
    }
  }
  removeDuplicateIds();
};

function checkObject(obj, id) {
  if (obj.elementType && obj.elementType.startsWith("characters") && obj.elementID === id) {
    return true;
  } else {
    return false;
  }
}

async function geTimelineFiltred(filter) {
  $('#timelineMain').empty();
  const project = await getCurrentProject();
  const resultSorted = sortByDate(project.data.timeline);
  let prevDate = null;
  let prevLi = null;
  for (let i = 0; i < resultSorted.length; i++) {
    const ele = resultSorted[i];
    if (ele.pov_id === filter || checkObject(ele, Number(filter))) {
      const dateConverted = convertDatePTBR(ele.date);
      const symbolTitle = handleTitle(ele.elementType);
      const charName = await getElementTitle(ele.elementType, ele.elementID);
      const selectedCharColor = getCharColor(Number(ele.pov_id), project.data.characters);
      if (dateConverted === prevDate) {
        prevLi.find('p').append(`
        <a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `loadpageOnclick('timeline', ${ ele.id }, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
          <div id="${ele.id}" class="time" style="background: linear-gradient(to right, ${getColor(charName, selectedCharColor)} 0%, #2D333B 85%); color: ${charName.color || selectedCharColor ? 'black' : ''}">${symbolTitle} ${ele.title? ele.title : charName.name}</div>
          </a>
          <p><a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `loadpageOnclick('timeline', ${ ele.id }, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ ele.content }</a></p>
        `);
      } else {
        prevDate = dateConverted;
        const li = $(`
        <li>
          <div class="timeline-section">
            <a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `loadpageOnclick('timeline', ${ ele.id }, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">
              <div class="timeDate">${ dateConverted }</div>
              <div class="time" style="background: linear-gradient(to right, ${getColor(charName, selectedCharColor)} 0%, #2D333B 85%); color: ${charName.color || selectedCharColor ? 'black' : ''}">${symbolTitle} ${ele.title? ele.title : charName.name}</div>
              </a>
              <p><a class="${ele.title? '' : 'noPonter'}" onclick="${ele.title? `loadpageOnclick('timeline', ${ ele.id }, '#dinamic', 'components/detailTimeline/page.html', 'components/detailTimeline/script.js')` : ''}">${ ele.content }</a></p>
          </div>
        </li>
        `);
        prevLi = li;
        $('#timelineMain').append(li);
      }
    }
    removeDuplicateIds()
  }
  changeInnerTabColor('tab'+filter)
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
  await db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.timeline.push(data) 
    }
  );
  await updateLastEditList('timeline', ID);
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

setCustomTimelineTabs('timeline');
getTimeline();
validateNewCard("timelineName", "#okBtn-timeline");
validateNewCard("catCharacterName", "#okBtn-cat-time");
validateNewCard("categoryDeltimelineName", "#okBtn-delcatTimeline");

function reduceString(str) {
  if (str.length > 35) {
    return str.slice(0, 35) + '...';
  }
  return str;
}

async function getTimelineSimle(id) {
  const project = await getCurrentProject();
  const resultSorted = sortByDate(project.data.timeline);
  for (let i = 0; i < resultSorted.length; i++) {
    const ele = resultSorted[i];
    const dateConverted = convertDatePTBR(ele.date);
    const symbolTitle = handleTitle(ele.elementType);
    const charName = await getElementTitle(ele.elementType, ele.elementID);
    const titleShort = reduceString(ele.title);
    $(id).append(
      `
      <option value='${ele.date}'>
        <div> ${ dateConverted } - ${symbolTitle} ${ele.title? titleShort : charName.name}</div>
      </option>
      `
    );
  }
}