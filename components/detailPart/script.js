async function applyChapterslist(id, idChars) {
  const project = await getCurrentProject();
  $(id).empty();
  $(id).append($('<h3></h3>').val('').html('Lista de capítulos:'))
  const resultSorted = sortByKey(project.data.chapters, 'position')
  resultSorted.forEach( (ele) => {
    if (idChars.includes(ele.id)) {
      return $(id).append($(`<button style='margin: 5px; color: black; background-color: #8F8F8F; border-radius: 5px; padding: 5px'></button><br>`).val(ele.id).html(ele.title))
    }
  })
};

async function restorePartCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.parts.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(async key => {
        const result = document.getElementById(key);
        if (key === "chapters") {
          await applyChapterslist("#chapter_list", ele[key]);
          ele[key].length === 0 ? document.getElementById('chapter_list').innerHTML = '' : null;
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
  projectData.data.parts.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("input", async () => {
        await lastEditListModify('parts', currentCardID);
        const field = elem.id
        await db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.parts[positionInArray][field] = elem.value;
        });
      });
    }
  })
});

$( "#dialog-delete-part" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await deleteCard('parts');
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
$( "#deletePartCard" ).click(function( event ) {
	$( "#dialog-delete-part" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

restorePartCard();
// restoreCategories('world');

var innerTabDefault = document.querySelector('.innerTabDefault');
document.querySelectorAll(".target").forEach( ele => ele.remove());

var label = document.createElement('p');
label.innerText = "Adicionar:";
label.classList = "extraInfosTab";
innerTabDefault.appendChild(label);

// Add Personagens ==========================>
var btnAddCharacters = document.createElement('button');
btnAddCharacters.innerText = 'Capítulos à parte';
btnAddCharacters.id = 'btn-addChaptersToPart';
btnAddCharacters.classList = "btnExtra ui-button ui-corner-all"
innerTabDefault.appendChild(btnAddCharacters);

async function saveCheckedValues() {
  const form = document.getElementById("chapterToPart");
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
    e.data.parts[positionInArray].chapters = checkedValues;
  });
}


$( "#dialog-addChaptersToPart" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await saveCheckedValues()
        $( this ).dialog( "close" );
        restorePartCard()
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
$( "#btn-addChaptersToPart" ).click(function( event ) {
	$( "#dialog-addChaptersToPart" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

restoreChapListInput("#chapterToPart");
