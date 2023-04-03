async function restoreNoteCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.notes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(key => {
        const result = document.getElementById(key);
        if (key === "image_card" && ele[key] !== '') {
          var cardbackgrond = document.getElementById("imageCardBackgournd");
          cardbackgrond.classList.add("imageCardBackgournd");
          cardbackgrond.children[0].style.backgroundImage =  `url(${ ele[key] })`;
          cardbackgrond.children[0].classList.add("cardImageDiv");
          result.setAttribute("src", ele[key]);
          result.classList.add("cardImage");
        } if (result) {
          return result.value = ele[key];
        }
      })
      resumeHeight("content")
    }
  })
};

var elementsArray = document.querySelectorAll(".projectInputForm");

elementsArray.forEach(async function(elem) {
  const currentID = await getCurrentProjectID();
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  const positionInArray = await getCurrentCard();
  projectData.data.notes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("input", async () => {
        await lastEditListModify('notes', currentCardID);
        const field = elem.id
        await db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.notes[positionInArray][field] = elem.value;
        });
        updateLastEdit(currentID);
      });
    }
  })
});

$( "#dialog-delete-note" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await deleteCard('notes');
        $( this ).dialog( "close" );
        loadpage('notas');
			}
		},
		{
			text: "Cancel",
      id: "btnTwoNotes",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
});
// Link to open the dialog
$( "#deleteNoteCard" ).click(function( event ) {
	$( "#dialog-delete-note" ).dialog( "open" );
  $("#btnTwoNotes").focus();
	event.preventDefault();
});

document.getElementById("btnSaveWall").disabled = true;
document.getElementById("my-image").addEventListener('input', () => { 
  document.getElementById("btnSaveWall").disabled = false;
});

restoreNoteCard();
restoreCategories('notes');
