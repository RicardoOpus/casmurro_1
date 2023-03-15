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
  restorePOV('#povName');
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
  restoreDelCategories('scenes', '#povDelName');
  event.preventDefault();
});

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getScenesCardsFiltred(filterCategory);
}

async function getScenesdCards() {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.scenes, 'position')
  resultSorted.forEach( (ele) => {

    const povID = project.data.characters.map(function (e) { return e.id; }).indexOf(Number(ele.pov_id));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    const povColor = project?.data?.characters?.[povID]?.color ?? '';
    const placeID = project.data.world.map(function (e) { return e.id; }).indexOf(Number(ele.place_id));
    const placeName = project?.data?.world?.[placeID]?.title ?? '';
    const dateConverted = convertDateBR(ele.date);
    $('#project-list').append(
      `
        <ul class="worldListScenes" id="${ele.id}">
          <li class="worldItens">
          <div class="ui-widget-content portlet ui-corner-all" onclick="setCurrentCard('scenes', ${ ele.id })">
          <div class="contentListWorld">
          <div class="ui-widget-header ui-corner-all portlet-header">${ ele.title }
          <a onclick="pageChange('#project-list', 'components/detailScene/page.html', 'components/detailScene/script.js')">
            </div>
              <p class="infosCardScenes"><span class="povLabel" style="background-color:${povColor}">${ !ele.pov_id ? '⮞⮞⮞ ' : povName }</span> 
                ${ !ele.date ? '' : `• ${dateConverted}`} 
                ${ !ele.time ? '' : `• ${ele.time}`} 
                ${ !ele.place_id ? '' : `• ${placeName}`}
              </p>
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

async function getScenesCardsFiltred(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.world, 'title')
  resultSorted.forEach( (ele) => {
    if (ele.category === filter) {
      $('#project-list').append(
        `
        <div class="worldList" id="${ele.title}">
          <div class="worldItens">
          <div class="worldName paper" onclick="setCurrentCard('world', ${ ele.id })">
          <div class="contentListWorld">
          <p class="wordlTitle">${ ele.title }</p>
          <a onclick="pageChange('#project-list', 'components/world/page.html', 'components/world/script.js')">
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
          </div>
        </div>
        `
      );
    } else {
      null
    }
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
    chapter: '',
    position: 'Z',
    content: '',
    date: '',
    time: '',
    pov_id: '',
    place_id: '',
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.scenes.push(data) 
    }
  );  
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

setCustomTabs('scenes');
getScenesdCards();
validateNewCard("sceneName", "#okBtn-scene");
validateNewCard("povName", "#okBtn-cat");
validateNewCard("povDelName", "#okBtn-delpov");
document.getElementById("project-list").className = "listCardsScenes"

$(function() {
  $("#project-list").sortable({
    update: function(event, ui) {
      console.log("chegou aqui");
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