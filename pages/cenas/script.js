console.log("Chamou Cenas!");
changeTabColor("cenas");

$( "#dialogScene" ).dialog({
autoOpen: false,
width: 600,
buttons: [
  {
    text: "Ok",
    id: "okBtn-scene",
    disabled: false,
    click: async function() {
      await createNewScene();
      $( this ).dialog( "close" );
      document.getElementById("sceneName").value = "";
      pageChange('#dinamic', 'pages/cenas/page.html', 'pages/cenas/script.js')
    }
  },
  {
    text: "Cancel",
    click: function() {
      document.getElementById("sceneName").value = "";
      $( this ).dialog( "close" );
    }
  }]
});
// Link to open the dialog
$( "#dialog-link-scene" ).click(function( event ) {
  $( "#dialogScene" ).dialog( "open" );
  $( "#okBtn-scene" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("sceneName").value = "";
  })
  event.preventDefault();
});

$( "#dialog_new_pov" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-cat",
      disabled: false,
      click: async function() {
        var catPOV = document.getElementById("povName");
        await addNewCategory('scenes', catPOV.value);
        $( this ).dialog( "close" );
        document.getElementById("povName").value = "";
        pageChange('#dinamic', 'pages/cenas/page.html', 'pages/cenas/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("povName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Category
$( "#dialog-link-category" ).click(function( event ) {
  $( "#dialog_new_pov" ).dialog( "open" );
  $( "#okBtn-cat" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("povName").value = "";
    })
  restorePOV('#povName', 'characters');
  event.preventDefault();
});

$( "#dialog_delete_pov" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-delpov",
      disabled: false,
      click: async function() {
        var catDelPov = document.getElementById("povDelName");
        await removeCategory('scenes', catDelPov.value);
        $( this ).dialog( "close" );
        document.getElementById("povDelName").value = "";
        pageChange('#dinamic', 'pages/cenas/page.html', 'pages/cenas/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("povDelName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Delete Category
$( "#dialog-link-delcategory" ).click(function( event ) {
  $( "#dialog_delete_pov" ).dialog( "open" );
  $( "#okBtn-delpov" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("povDelName").value = "";
    })
    restoreDelPovTab('scenes', '#povDelName');
  event.preventDefault();
});

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getScenesCardsFiltred(filterCategory);
}

async function getScenesdCards() {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.scenes, 'position');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  }
  resultSorted.forEach( (ele) => {
    const povID = project.data.characters.map(function (e) { return e.id; }).indexOf(Number(ele.pov_id));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    const povColor = project?.data?.characters?.[povID]?.color ?? '';
    const resultDate = project.data.timeline.map(function (e) { return e.id; }).indexOf(Number(ele.date));
    const dateValue = project?.data?.timeline?.[resultDate]?.date ?? '';
    const chapters = project?.data?.chapters
    const chapterName = getChapterName(chapters, ele.id);
    const dateConverted = convertDatePT_BR(dateValue);
    $('#project-list').append(
      `
        <ul class="worldListScenes" id="${ele.id}">
          <li class="worldItens">
          <div class="ui-widget-content portlet ui-corner-all" onclick="setCurrentCard('scenes', ${ ele.id })">
          <div class="contentListWorld">
          <div class="ui-widget-header ui-corner-all portlet-header">${ ele.title }
          <a onclick="pageChange('#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')">
            </div>
              <p class="infosCardScenes"><span class="povLabel" style="background-color:${ele.pov_id ? povColor: ""}">${ !ele.pov_id ? '&nbsp;&nbsp;&nbsp' : povName }</span> 
              ${ !ele.status ? '' : ` ${ele.status}` }
                ${ !ele.date ? '' : `• ${dateConverted}`}
              </p>
              <p class="infosCardScenes">${ !chapterName ? '' : `Cap. ${chapterName}` }</p>
            </div>
            <div>  
              <p class="sceneCartContent">${ ele.content }</p>
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

async function createNewScene() {
  const ID = await idManager('id_scenes')
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const sceneName = document.getElementById("sceneName");
  const data = {
    title: sceneName.value,
    position: 'Z',
    content: '',
    date: '',
    pov_id: '',
    place_id: '',
    id: ID
  };
  await db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.scenes.push(data) 
    }
  );
  await updateLastEditList('scenes', ID);
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

setCustomPovTabs('scenes');
getScenesdCards();
validateNewCard("sceneName", "#okBtn-scene");
validateNewCard("povName", "#okBtn-cat");
validateNewCard("povDelName", "#okBtn-delpov");
document.getElementById("project-list").className = "listCardsScenes"

$(function() {
  $("#project-list").sortable({
    update: function(event, ui) {
      savePositions();
    }
  });
  $("#project-list").disableSelection();
  function savePositions() {
    $("#project-list .worldListScenes").each(async function() {
      var id = $(this).attr("id");
      var position = $(this).index();
      var currentID = await getCurrentProjectID();
      var positionInDB = await getCurrentScene(Number(id)) 
      db.projects.where('id').equals(currentID).modify( (ele) => {
        ele.data.scenes[positionInDB].position = position;
        }
      );
    });
  }
});