console.log('chamou subplotes');
changeTabColor("estrutura");
changeInnerTabColor('subplotsTab');

$( "#dialogStructure" ).dialog({
autoOpen: false,
width: 600,
buttons: [
  {
    text: "Ok",
    id: "okBtn-structure",
    disabled: false,
    click: async function() {
      const validade = validadeForm();
      if (validade) {
        await createNewStructure();
        $( this ).dialog( "close" );
        document.getElementById("structureName").value = "";
        document.getElementById("structureType").value = "";
        pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script.js')
      } else {
        alert('Por favor, preencha todas as informações!')
      }
    }
  },
  {
    text: "Cancel",
    click: function() {
      document.getElementById("structureName").value = "";
      document.getElementById("structureType").value = "";
      $( this ).dialog( "close" );
    }
  }]
});
// Link to open the dialog
$( "#dialog-link-structure" ).click(function( event ) {
  $( "#dialogStructure" ).dialog( "open" );
  $( "#okBtn-structure" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("structureName").value = "";
  })
  event.preventDefault();
});

function putScenesInChapters(arrayChapters, idPart, filterChapters) {
  arrayChapters.forEach( (ele, i) => {
    if (filterChapters?.includes(ele.id)) {
      $(idPart).append(
        `
        <li>${ele.title}</li>
        `
      );
    }
  })
}

function putChaptersInPat(arrayChapters, idPart, filterChapters, arrayScenes) {
  if (!filterChapters) {
    return arrayChapters.forEach( (elem, i) => {
        $(idPart).append(
          `
          <p class="ChapterOutline"> ${elem.title}
          </p>
          <ul id="List${i}" class="SceneOutline"></ul>
          `
        );
        putScenesInChapters(arrayScenes,  `#List${i}`, elem.scenes)
    })
  }
  return arrayChapters.forEach( (elem, i) => {
    if (filterChapters?.includes(elem.id)) {
      $(idPart).append(
        `
        <p class="ChapterOutline"> ${elem.title}
        </p>
        <ul id="List${i}" class="SceneOutline"></ul>
        `
      );
      putScenesInChapters(arrayScenes,  `#List${i}`, elem.scenes)
    }
  })
}

async function getStructureFiltred() {
  $('#project-list').empty();
  $('#project-list').append("<div id='outlineContent' class='cardStructure'></div>")
  const project = await getCurrentProject();
  const partsSorted = sortByKey(project.data.parts, 'position')
  const chaptersSorted = sortByKey(project.data.chapters, 'position')
  if (chaptersSorted.length === 0) {
    return $('#outlineContent').append('<p>No momenton não existem capítulos.</p><p>Crie capítulos (adicione cenas) para vizializr a estrutura.</p>')
  }
  const scenesSorted = sortByKey(project.data.scenes, 'position')
  if (partsSorted[0]?.chapters?.length > 0) {
    return partsSorted.forEach( async (ele, i) => {
      $('#outlineContent').append(
        `
        <h3 class="PartOutline">${ele.title}
        <hr class="chapterLine">
        </h3>
        <p id="partList${i}" style="margin: 0px"></p>
        `
      );
      putChaptersInPat(chaptersSorted, `#partList${i}`, ele.chapters, scenesSorted)
    })
  }
  return putChaptersInPat(chaptersSorted, '#outlineContent', null, scenesSorted)
};

async function createNewStructure() {
  const ID = await idManager('id_structure')
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const structureName = document.getElementById("structureName");
  const structureCat = document.getElementById("structureType");
  const data = {
    title: structureName.value,
    content: '',
    position: 'Z',
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data[structureCat.value].push(data) 
    }
  );
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

getStructureFiltred();
validateNewCard("structureName", "#okBtn-structure");
validateNewCard("structureType", "#okBtn-structure");
document.getElementById("project-list").className = "worldListStructure"

