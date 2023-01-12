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

// Link to open the dialog
$( "#deleteProject" ).click(function( event ) {
	$( "#dialog-delete-project" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});
