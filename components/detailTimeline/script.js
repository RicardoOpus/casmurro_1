console.log('chamou detail timeline');

async function restoreCharactersCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.timeline.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(key => {
        const result = document.getElementById(key);
        if (result) {
          return result.value = ele[key];
        }
      })
      resumeHeight("content")
    } else {
      return null
    }
  })
};

var elementsArray = document.querySelectorAll(".projectInputForm");

elementsArray.forEach(async function(elem) {
  const currentID = await getCurrentProjectID();
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  const positionInArray = await getCurrentCard();
  projectData.data.timeline.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("input", async () => {
        const field = elem.id
        db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.timeline[positionInArray][field] = elem.value;
        });
      });
    } else {
      return null
    }
  })
});

$( "#dialog-delete-timeline" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await deleteCard('timeline');
        $( this ).dialog( "close" );
        loadpage('timeline');
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
$( "#deleteTimelineCard" ).click(function( event ) {
	$( "#dialog-delete-timeline" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

restoreCharactersCard();
restoreCategories('world');
