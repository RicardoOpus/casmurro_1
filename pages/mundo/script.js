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



function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

async function getWorldCards() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const result = await db.projects.get(idProject);
  const resultSorted = sortByKey(result.data.world, 'title')

  resultSorted.forEach( (ele) => {
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
    setContentOpacity();
    setImageOpacity();
  })
};


async function getWorldCardsFiltred(filter) {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const result = await db.projects.get(idProject);
  result.data.world.forEach( (ele, i) => {
    if (ele.category === filter) {
      $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens">
          <a onclick="pageChange('#project-list', 'components/world/page.html', 'components/world/script.js')">
            <div class="worldName paper" onclick="setCurrentCard(${ i })">
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
  const ID = await idManager('id_world')
  console.log(ID);
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const worldName = document.getElementById("worldName");
  var data = {
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
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

getWorldCards();
// getWorldCardsFiltred('Local');
validateNewCard("worldName", "#okBtn-world");