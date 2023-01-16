console.log("Chamou Mundo!");
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
      pageChange('#dinamic', 'pages/mundo/page.html', 'pages/mundo/script.js')
    }
  },
  {
    text: "Cancel",
    click: function() {
      document.getElementById("worldName").value = "";
      document.getElementById("worldCat").value = "";
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
  document.getElementById("worldCat").value = "";
})
event.preventDefault();
});

async function getWorldCards() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const result = await db.projects.get(idProject);
  console.log(result.data.world);
  result.data.world.forEach( (ele) => {
    $('#project-list').append(
      `
      <ul class="worldList">
        <li class="worldItens">
          <div class="worldName paper" onclick="setProjectAtual()">
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
        </li>
      </ul>
      `
    );
    setContentOpacity();
    setImageOpacity();
  })
};

function setContentOpacity() {
  const content = document.querySelectorAll(".it");
  content.forEach( (cont) => {
    if (cont.clientHeight > 149) {
      cont.classList.add("worldContent")
    }
  })
}

function setImageOpacity() {
  const content = document.querySelectorAll(".worldListImage");
  content.forEach( (cont) => {
    if (cont.clientHeight > 149) {
      cont.classList.add("worldListImageOpacity")
    }
  })
}

async function createNewWorld() {
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const worldName = document.getElementById("worldName");
  const worldCat = document.getElementById("worldCat");
  var data = {
    title: worldName.value,
    category: worldCat.value,
    image_card: '',
    content: ''
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.world.push(data) 
    }
  );  
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};


getWorldCards();
validateNewCard("worldName", "#okBtn-world");