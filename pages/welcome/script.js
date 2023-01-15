  console.log('chamou Welcome (dentro)');
  $( "#dialog" ).dialog({
	autoOpen: false,
	width: 600,
	buttons: [
		{
			text: "Ok",
      id: "okBtn",
      disabled: false,
			click: async function() {
        await createNewProject();
        $( this ).dialog( "close" );
        pageChange('#dinamicPage', 'pages/dashboard/page.html', 'pages/dashboard/script.js')
			}
		},
		{
			text: "Cancel",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
});

// Link to open the dialog
$( "#dialog-link" ).click(function( event ) {
	$( "#dialog" ).dialog( "open" );
  $( "#okBtn" ).addClass( "ui-button-disabled ui-state-disabled" )
	event.preventDefault();
});

function validateNewProject() {
  const inputName = document.getElementById("projectName");
  inputName.addEventListener('input', (event) => {
    const inputValue = inputName.value
    if (!inputValue) {
      $( "#okBtn" ).addClass( "ui-button-disabled ui-state-disabled" )
    } else {
      $( "#okBtn" ).removeClass( "ui-button-disabled ui-state-disabled" )
    }
  });
}

async function createNewProject() {
  const inputName = document.getElementById("projectName");
  const currentDate = new Date();
  const timeStamp = Date.now();
  const data = { world: [] }
  console.log(typeof(timeStampI));
  const idNew = await db.projects.add(
    { title: inputName.value,
      status: "novo",
      cards_qty: 0,
      data: data,
      literary_genre: null,
      description: null,
      image_cover: null,
      created_at: currentDate,
      last_edit: currentDate,
      timestamp: timeStamp,
    }).then();
  const updadeCurrent = await db.settings.update(1,{ currentproject: idNew });
  inputName.value = '';
  return updadeCurrent;
};

function disableNavBar() {
  const navBarButtons = document.querySelectorAll(".navtrigger");
  navBarButtons.forEach( (buton) => {
    buton.style.display = 'none';
  })
}

async function setProjectAtual(id) {
  const result = await db.settings.update(1, {currentproject: id});
  pageChange('#dinamicPage', 'pages/dashboard/page.html', 'pages/dashboard/script.js');
  return result;
}

async function listProjects() {
  const result = await db.projects.orderBy('timestamp').desc();
  await result.each(function (project) {
      const dateEdit = convertDateBR(project.last_edit);
      const timeEdit = convertToTime(project.last_edit);
      $('#project-list').append(
        `
        <ul class="projectsList">
          <li class="projectsItens zoom">
          <a class="projectsName" onclick="setProjectAtual(${ project.id })">
          <img src="${ !project.image_cover ? 'assets/images/manuscript.jpeg' : project.image_cover }" class="coverImage"> 
              <div>
                <p class="projectTitle">${ project.title }</p>
                <p class="projectCreated"><span class="ui-icon ui-icon-calendar"></span>Modificado em: <strong>${ dateEdit }</strong> | <strong>${ timeEdit }</strong></p>
              </div>
              <span class="projectStatus"> ${ project.status } </span>
              <div>${ !project.literary_genre ? '' : project.literary_genre }</div>
              <div class="cards">
                <p class="projectTitle"><strong>${ project.cards_qty }</strong></p>
                <p class="projectCreated">Cartões</p>  
              </div>
          </a>
          </li>
        </ul>
        `
      );
    })
  changeStatusColor()
  return result
}

function changeStatusColor() {
  const statusHtml = document.querySelectorAll(".projectStatus");
  statusHtml.forEach( (elem) => {
    const classStatus = elem.innerText;
    const n = classStatus.split(" ").pop();
    elem.classList.add(n);
  })
}

restoreBackground() 

$( document ).ready(function() {
  listProjects();
  validateNewProject();
  disableNavBar();
});
