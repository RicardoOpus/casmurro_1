changeTabColor("estrutura");

async function applySceneslist(id, idChars) {
  const project = await getCurrentProject();
  $(id).empty();
  $(id).append($('<h3></h3>').val('').html('Lista de cenas:'))
  const resultSorted = sortByKey(project.data.scenes, 'position')
  resultSorted.forEach( (ele) => {
    if (idChars.includes(ele.id)) {
      return $(id).append($(`<button onclick="loadpageOnclick('scenes', ${ele.id}, '#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')" style='margin: 5px; color: black; background-color: #8F8F8F; border-radius: 5px; padding: 5px; cursor: pointer'></button><br>`).html(ele.title))
    }
  })
};

async function restoreChapterCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.chapters.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(async key => {
        const result = document.getElementById(key);
        if (key === "scenes") {
          await applySceneslist("#scenes_list", ele[key]);
          ele[key].length === 0 ? document.getElementById('scenes_list').innerHTML = '' : null;
        } if (result) {
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
        await lastEditListModify('chapters', currentCardID);
        const field = elem.id
        await db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.chapters[positionInArray][field] = elem.value;
        });
        updateLastEdit(currentID);
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

async function saveCheckedValues() {
  const form = document.getElementById("scenesToChapter");
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  const checkedValues = [];
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.push(Number(checkbox.value));
    }
  });
  db.projects.where('id').equals(currentID).modify( (e) => {
    e.data.chapters[positionInArray].scenes = checkedValues;
  });
}

$( "#dialog-addScenetoChap" ).dialog({
	autoOpen: false,
	width: 500,
  maxHeight: 600,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await saveCheckedValues()
        $( this ).dialog( "close" );
        restoreChapterCard()
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
$( "#btn-addSceneToChap" ).click(function( event ) {
	$( "#dialog-addScenetoChap" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

restoreScenesListInput("#scenesToChapter");
