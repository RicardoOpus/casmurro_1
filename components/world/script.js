document.getElementById("category").addEventListener('change', (e) => enableDateInput(e.target.value))

async function enableDateInput(target) {
  const divDate = document.getElementById("div_Date");
  target === 'Fato_histórico' ? divDate.removeAttribute("style") : divDate.style.display = "none";
  target !== 'Fato_histórico' ? clearDate() : '';
};

async function clearDate() {
    document.getElementById("date").value = '';
    const currentID = await getCurrentProjectID();
    const currentCard = await getCurrentCard();
    return db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.world[currentCard].date = '';
    })
};

async function restoreWordCard() {
  const currentID = await getCurrentProjectID();
  const projectData = await db.projects.get(currentID);
  const currentCard = await getCurrentCard();
  const dataObj = projectData.data.world[currentCard];
  Object.keys(dataObj).forEach(key => {
    const result = document.getElementById(key);
    if (key === "date" &&  dataObj[key] !== '') {
      const divDate = document.getElementById("div_Date");
      divDate.removeAttribute("style");
      const dateConverted = convertDateBR(dataObj[key]);
      const date = convertDateUS(dateConverted);
      return result.value = date;
    } if (key === "image_card") {
      var cardbackgrond = document.querySelector(".cardImageDiv");
      cardbackgrond.style.backgroundImage =  `url(${ dataObj[key] })`;
      // cardbackgrond.children[0].style.backgroundImage =  `url(${ dataObj[key] })`;
      result.setAttribute("src", dataObj[key]);
    } if (result) {
      return result.value = dataObj[key];
    }
  })
};

var elementsArray = document.querySelectorAll(".projectInputForm");

elementsArray.forEach(async function(elem) {
  const currentID = await getCurrentProjectID();
  const currentCard = await getCurrentCard();
    elem.addEventListener("input", async () => {
      const field = elem.id
      if (elem.id === "date") {
        const dateObject = new Date(elem.value);
        const tomorrow = new Date(dateObject);
        const dateSum1 = tomorrow.setDate(dateObject.getDate()+1);
        const correctDate = new Date(dateSum1);
        return db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.world[currentCard][field] = correctDate;
        });
      } else {
        db.projects.where('id').equals(currentID).modify( (e) => {
          e.data.world[currentCard][field] = elem.value;
        });
        // db.projects.update(projectID, obj);
      }
    });
});

$( "#dialog-delete-world" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await deleteCard('world');
        $( this ).dialog( "close" );
        loadpage('mundo');
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
	$( "#dialog-delete-world" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

async function restoreProjectCover() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  await db.projects.update(projectData.id, {image_cover: null})
  pageChange('#dinamicPage', 'pages/dashboard/page.html', 'pages/dashboard/script.js');
};

document.getElementById("btnSaveWall").disabled = true;
document.getElementById("my-image").addEventListener('input', () => { 
  document.getElementById("btnSaveWall").disabled = false;
});

restoreWordCard();
