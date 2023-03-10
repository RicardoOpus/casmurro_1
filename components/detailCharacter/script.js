// document.getElementById("category").addEventListener('change', (e) => enableDateInput(e.target.value))

// async function clearDate() {
//   document.getElementById("date").value = '';
//   const currentID = await getCurrentProjectID();
//   const positionInArray =  await getCurrentCard();
//   return db.projects.where('id').equals(currentID).modify( (e) => {
//       e.data.world[positionInArray].date = '';
//     })
// };

// async function enableDateInput(target) {
//   const divDate = document.getElementById("div_Date");
//   target === 'Fato histórico' ? divDate.removeAttribute("style") : divDate.style.display = "none";
//   target !== 'Fato histórico' ? clearDate() : '';
// };

async function restoreWordCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.characters.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(key => {
        const result = document.getElementById(key);
        if (key === "date" &&  ele[key] !== '') {
          const divDate = document.getElementById("div_Date");
          divDate.removeAttribute("style");
          const dateConverted = convertDateBR(ele[key]);
          const date = convertDateUS(dateConverted);
          return result.value = date;
        } if (key === "image_card" && ele[key] !== '') {
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
      resumeHeight()
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
  projectData.data.characters.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("input", async () => {
        const field = elem.id
        if (elem.id === "date") {
          const dateObject = new Date(elem.value);
          const tomorrow = new Date(dateObject);
          const dateSum1 = tomorrow.setDate(dateObject.getDate()+1);
          const correctDate = new Date(dateSum1);
          return db.projects.where('id').equals(currentID).modify( (e) => {
            e.data.characters[positionInArray][field] = correctDate;
          });
        } else {
          db.projects.where('id').equals(currentID).modify( (e) => {
            e.data.characters[positionInArray][field] = elem.value;
          });
          // db.projects.update(projectID, obj);
        }
      });
    } else {
      return null
    }
  })
});

$( "#dialog-delete-char" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await deleteCard('characters');
        $( this ).dialog( "close" );
        loadpage('personagens');
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
$( "#deleteWorldCard" ).click(function( event ) {
	$( "#dialog-delete-char" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

document.getElementById("btnSaveWall").disabled = true;
document.getElementById("my-image").addEventListener('input', () => { 
  document.getElementById("btnSaveWall").disabled = false;
});

restoreWordCard();
restoreCategories('characters');
