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
  const idNew = await db.projects.add(
    { title: inputName.value,
      status: "novo",
      cards_qty: 0,
      created_at: currentDate,
      last_edit: currentDate,
    }).then();
  const updadeCurrent = await db.settings.update(1,{ currentproject: idNew });
  inputName.value = '';
  return updadeCurrent;
};

function disableNavBar() {
  const navBarButtons = document.querySelectorAll(".navtrigger");
  navBarButtons.forEach( (buton) => {
    buton.style.display = 'none'
  })
}

async function listProjects() {
  const result = await db.projects
    .each(function (project) {
      const dateCreated = convertDateBR(project.created_at);
      const timeCreated = convertToTime(project.created_at);
      const dateEdit = convertDateBR(project.last_edit);
      const timeEdit = convertToTime(project.last_edit);
      $('#project-list').append(
        `
        <ul class="projectsList">
          <li class="projectsItens">
          <a class="projectsName">
          <img src="/casmurro/assets/images/manuscript.jpeg" class="coverImage"> 
              <div>
                <p class="projectTitle">${ project.title }</p>
                <p class="projectCreated"><span class="ui-icon ui-icon-calendar"></span>Criado em: <strong>${ dateCreated }</strong> | <strong>${ timeCreated }</strong></p>
              </div>
              <span class="projectStatus new"> ${ project.status } </span>
              <div>${ !project.literary_genre ? 'Romance' : project.literary_genre }</div>
              <div class="cards">
                <p><strong>${ project.cards_qty }</strong></p>
                <p class="projectCreated">Cartões</p>  
              </div>
              <img src="/casmurro/assets/images/cards2.jpeg" class="cardsImage">     
          </a>
          </li>
        </ul>
        `
      );
    })
  return result
}


$( document ).ready(function() {
  listProjects();
  validateNewProject();
  disableNavBar()
});
