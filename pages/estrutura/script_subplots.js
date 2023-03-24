console.log('chamou subplotes');
changeTabColor("estrutura");
changeInnerTabColor('subplotsTab');

function validadeForm() {
  const dateField = document.getElementById("structureType").value
  const date2Field = document.getElementById("structureName").value
  return dateField && date2Field !== "" ? true : false;
}

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
        pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script_subplots.js')
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

async function getStructureFiltred(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data[filter], 'position')
  resultSorted.forEach( (ele, i) => {
    $('#project-list').append(
      `
      <ul class="worldListStructure" id="${ele.id}">
        <li class="worldItens">
        <div class="ui-widget-content portlet ui-corner-all" onclick="setCurrentCard('scenes', ${ ele.id })">
        <div class="contentListWorld">
        <div class="ui-widget-header ui-corner-all portlet-header">${ ele.title }
        <a onclick="pageChange('#project-list', 'components/detailScene/page.html', 'components/detailScene/script.js')">
          </div>
            <p class="infosCardScenes">${ !ele.status ? '' : ele.status }</p>
          </div>
          <div>  
            <p class="sceneCartContent">${ ele.content? ele.content : '<br>' }</p>
          </div>
          </div>
        </a>
        </li>
      </ul>
      `
    );
  setContentOpacity();
  })
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

getStructureFiltred('subplots');
validateNewCard("structureName", "#okBtn-structure");
validateNewCard("structureType", "#okBtn-structure");
document.getElementById("project-list").className = "worldListStructure"

$(function() {
  $("#project-list").sortable({
    update: function(event, ui) {
      savePositions();
    }
  });
  $("#project-list").disableSelection();
  async function savePositions() {
    const worldListStructure = $("#project-list .worldListStructure");
    for (let i = 0; i < worldListStructure.length; i++) {
      var id = $(worldListStructure[i]).attr("id");
      var position = $(worldListStructure[i]).index();
      var currentID = await getCurrentProjectID();
      var positionInDB = await getStructureByID('subplots', Number(id));
      await db.projects.where('id').equals(currentID).modify( (ele) => {
        ele.data.subplots[positionInDB].position = position;
      });
    }
    pageChange('#dinamic', 'pages/estrutura/page.html', 'pages/estrutura/script_subplots.js')
  }
});
