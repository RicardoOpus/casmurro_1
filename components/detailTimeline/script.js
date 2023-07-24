changeTabColor("timeline");

function updateSideBar() {
  $('.sideBar').empty();
}
updateSideBar();

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
      elem.addEventListener("change", async () => {
        await lastEditListModify('timeline', currentCardID);
        const field = elem.id
        await db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.timeline[positionInArray][field] = elem.value;
        });
        updateLastEdit(currentID);
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
      id: "btnDelTimeline",
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
// restoreCategories('world');

restorePOV("#pov_id", "characters");