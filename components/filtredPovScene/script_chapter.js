// /* eslint-disable */
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
  localStorage.setItem('tabScenes', tab);
  localStorage.setItem('ScenesLastTab', 'POV');
  if (tab === 'All') {
    loadpage('cenas');
  } else {
    changeInnerTabColor(tab);
    ocultarElementosPOV(filterCategory);
  }
}
function getChapInfos(chaptersData) {
  $('.sideBar').empty();
  const div = document.getElementById('sideBar');
  div.style.display = 'block';
  div.innerHTML = `<p>Capítulo:</p><h2 style="cursor:pointer" onclick="loadpageOnclick('chapters', ${chaptersData[0].id}, '#dinamic', 'components/detailChapter/page.html', 'components/detailChapter/script.js')">${chaptersData[0].title ? chaptersData[0].title : ''}</h2>
  <h3>${chaptersData[0].scenes.length} cenas</h3>
  <p>${chaptersData[0].content}</p>
  `;
}

async function getScenesCardsFiltred(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.scenes, 'position');
  const chpterScenes = project.data.chapters.filter( (ele) => ele.id === Number(filter));
  const chpterScenesList = chpterScenes[0].scenes;
  const resultFiltred = [];
  if (!chpterScenesList || chpterScenesList?.length === 0 ) {
    return $('#project-list').append(`<p style='margin: 15px 55px'>Sem cenas para este capítulo</p>`);
  }
  resultSorted.forEach( (element) => {
    if (chpterScenesList.includes(element.id)) {
      resultFiltred.push(element)
    }
  })
  resultFiltred.forEach( (ele, i) => {
    const povID = project.data.characters.map(function (e) { return e.id; }).indexOf(Number(ele.pov_id));
    const povName = project?.data?.characters?.[povID]?.title ?? '';
    const povColor = project?.data?.characters?.[povID]?.color ?? '';
    const resultDate = project.data.timeline.map(function (e) { return e.id; }).indexOf(Number(ele.date));
    const dateValue = project?.data?.timeline?.[resultDate]?.date ?? '';
    const chapters = project?.data?.chapters;
    const chapterName = getChapterName(chapters, ele.id);
    const dateConverted = convertDatePTBR(dateValue);
    $('#project-list').append(
      `
      <ul class="worldListScenes" id="${ele.id}">
        <li class="worldItens">
          <div class="worldName portlet ui-corner-all">
            <div class="contentListWorld">
              <div data-testid='scene-${ ele.id }' class="ui-widget-header ui-corner-all portlet-header">${ele.title}</div>
                <a onclick="loadpageOnclick('scenes', ${ ele.id }, '#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')">
                <p class="infosCardScenes"><span class="povLabel" style="background-color:${ele.pov_id ? povColor: ""}">${ !ele.pov_id ? '&nbsp;&nbsp;&nbsp' : povName }</span> 
                ${ !ele.status ? '' : ` ${ele.status}` }
                ${ !ele.date ? '' : `• ${dateConverted}`}
                </p>
                <p class="infosCardScenes">${ !chapterName ? '' : `Cap. ${chapterName}` }</p>
                <div>  
                  <p class="sceneCartContent">${ ele.content }</p>
                </div>
                </a>
            </div>
          </div>
        </li>
      </ul>
      `
    );
    setContentOpacity();
    setImageOpacity();
  });
  getChapInfos(chpterScenes);
}

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
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.scenes.push(data) 
    }
  );
  await updateLastEditList('scenes', ID);
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

var idRecoved = localStorage.getItem("chapterFilter");

getScenesCardsFiltred(idRecoved);
validateNewCard("sceneName", "#okBtn-scene");
validateNewCard("povName", "#okBtn-cat");
validateNewCard("povDelName", "#okBtn-delpov");
document.getElementById("project-list").className = "listCardsScenes";
