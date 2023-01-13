async function restoreProjectData() {
  const project = await db.settings.get(1);
  const projectID = project.currentproject;
  const projectData = await db.projects.get(projectID);
  const dateConverted = convertDateBR(projectData.created_at);
  const date = convertDateUS(dateConverted);
  Object.keys(projectData).forEach(key => {
    const result = document.getElementById(key);
    if (key === 'created_at') {
      return result.value = date;
    } if (key === 'last_edit') {
      return null
    } if (result) {
      return result.value = projectData[key];
    } 
  })
}
restoreProjectData()

var elementsArray = document.querySelectorAll(".projectInputForm");

elementsArray.forEach(async function(elem) {
  const project = await db.settings.get(1);
  const projectID = project.currentproject;
    elem.addEventListener("input", async () => {
      const obj = { oldKey: elem.value };
      obj[elem.id] = obj['oldKey'];
      delete obj['oldKey'];
      if (Object.keys(obj)[0] === "created_at") {
        const dateObject = new Date(obj.created_at); // cria data
        const tomorrow = new Date(dateObject);
        const dateSum1 = tomorrow.setDate(dateObject.getDate()+1);
        const correctDate = new Date(dateSum1)
        obj['created_at'] = correctDate;
        db.projects.update(projectID, obj);
      } else {
        db.projects.update(projectID, obj);
      }
    });
});

async function deleteProject() {
  const project = await db.settings.get(1);
  const projectID = project.currentproject;
  return await db.projects.delete(projectID);
}

$( "#dialog-delete-project" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await deleteProject();
        $( this ).dialog( "close" );
        loadpage('welcome');
			}
		},
		{
			text: "Cancel",
      id: "btnTwo",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
});

async function saveProjectCover() {
  console.log("clicou");
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  const fileInput = document.querySelector('#my-image');
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result
    await db.projects.update(projectData.id, {image_cover: base64String})
  };
  reader.readAsDataURL(file);
  pageChange('#dinamicPage', 'pages/dashboard/page.html', 'pages/dashboard/script.js')
};

async function restoreProjectCover() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  await db.projects.update(projectData.id, {image_cover: null})
  pageChange('#dinamicPage', 'pages/dashboard/page.html', 'pages/dashboard/script.js')
};

// Link to open the dialog
$( "#deleteProject" ).click(function( event ) {
	$( "#dialog-delete-project" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

function verify() {
  document.getElementById("btnSaveWall").disabled = false;
};

document.getElementById("btnSaveWall").disabled = true;
var teste = document.getElementById("my-image");
teste.addEventListener('input', () => {
  verify();
});
