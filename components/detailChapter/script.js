// document.getElementById("category").addEventListener('change', (e) => enableDateInput(e.target.value))

// async function enableDateInput(target) {
//   const divDate = document.getElementById("div_Date");
//   target === 'Fato histórico' ? divDate.removeAttribute("style") : divDate.style.display = "none";
//   target !== 'Fato histórico' ? clearDate('world') : '';
// };

async function restoreChapterCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.chapters.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(key => {
        const result = document.getElementById(key);
        if (result) {
          return result.value = ele[key];
        }
      })
      resumeHeight("content", "content_full")
    }
  })
};

var elementsArray = document.querySelectorAll(".projectInputForm");

elementsArray.forEach(async function(elem) {
  const currentID = await getCurrentProjectID();
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  const positionInArray = await getCurrentCard();
  projectData.data.chapters.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("input", async () => {
        const field = elem.id
        db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.chapters[positionInArray][field] = elem.value;
        });
      });
    }
  })
});

$( "#dialog-delete-chapter" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await deleteCard('chapters');
        $( this ).dialog( "close" );
        loadpage('estrutura');
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
$( "#deleteChapterCard" ).click(function( event ) {
	$( "#dialog-delete-chapter" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

restoreChapterCard();
// restoreCategories('world');
