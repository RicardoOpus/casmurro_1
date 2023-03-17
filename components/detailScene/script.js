function returnUrlImgWeather(param) {
  switch (param) {
    case 'Nascer do sol':
      return "url('../../assets/images/times/Nascer_do_sol.png')";
    case 'Manhã':
      return "url('../../assets/images/times/Manhã.png')";
    case 'Meio-dia':
      return "url('../../assets/images/times/Meio-dia.png')";
    case 'Tarde':
      return "url('../../assets/images/times/Tarde.png')";
    case 'Pôr do sol':
      return "url('../../assets/images/times/Pôr_do_sol.png')";
    case 'Noite':
      return "url('../../assets/images/times/Noite.png')";
    case 'Meia-noite':
      return "url('../../assets/images/times/Meia-noite.png')";
    case 'Madrugada':
      return "url('../../assets/images/times/Madrugada.png')";
    case 'Nublado':
      return "url('../../assets/images/times/Nublado.png')"
    case 'Chuvoso':
      return "url('../../assets/images/times/Chuvoso.png')"
    case 'Chuva ácida':
      return "url('../../assets/images/times/Chuva_acida.png')"
    case 'Granizo':
      return "url('../../assets/images/times/Granizo.png')"
    case 'Tempestuoso':
      return "url('../../assets/images/times/Tempestuoso.png')"
    case 'Neblina':
      return "url('../../assets/images/times/Neblina.png')"
    case 'Neve':
      return "url('../../assets/images/times/Neve.png')"
    case 'Tempestade de neve':
      return "url('../../assets/images/times/Tempestade_de_neve.png')"
    case 'Ciclone':
      return "url('../../assets/images/times/Ciclone.png')"
    default:
      return "url('')"
  }
}

function addBackgroundToMainDiv(time, placeID) {
  const mainDiv = document.getElementById(placeID);
  const resultImg = returnUrlImgWeather(time)
  mainDiv.style.backgroundImage = resultImg;
  mainDiv.style.backgroundRepeat = "no-repeat";
  mainDiv.style.backgroundSize = "contain";
  mainDiv.style.width = "100%";
  mainDiv.style.backgroundColor  = "#202024";
}

async function restoreSceneCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.scenes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(key => {
        const result = document.getElementById(key);
        if (key === "date" &&  ele[key] !== '') {
          const dateConverted = convertDateBR(ele[key]);
          const date = convertDateUS(dateConverted);
          return result.value = date;
        } if (key === "time" || key === "weather") {
            const noImg = ["Ensolarado", "Seco", "Quente", "Frio", "Úmido", "Vento", "Tempestade de areia"]
            if (!noImg.includes(ele[key])) {
              addBackgroundToMainDiv(ele[key], "detail_scene")
            }
          return result.value = ele[key];
        } if (result) {
          return result.value = ele[key];
        }
      })
      resumeHeight("content_full")
      resumeHeight("content")
    } else {
      return null
    }
  })
};

var elementsArray = document.querySelectorAll(".projectInputForm");

document.getElementById('time').addEventListener('change', function() {
  const mainDiv = document.getElementById("weather");
  !mainDiv.value ? addBackgroundToMainDiv(this.value, "detail_scene") : null;
});

document.getElementById('weather').addEventListener('change', function() {
  const mainDiv = document.getElementById("time");
  const noImg = ["Ensolarado", "Seco", "Quente", "Frio", "Úmido", "Vento", "Tempestade de areia"]
  if (!this.value ||  noImg.includes(this.value)) {
    addBackgroundToMainDiv(mainDiv.value, "detail_scene");
  } else {
    addBackgroundToMainDiv(this.value, "detail_scene");
  }
});

elementsArray.forEach(async function(elem) {
  const currentID = await getCurrentProjectID();
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  const positionInArray = await getCurrentCard();
  projectData.data.scenes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("change", async (event) => {
        const field = elem.id
        if (elem.id === "date") {
          const dateObject = new Date(elem.value);
          const tomorrow = new Date(dateObject);
          const dateSum1 = tomorrow.setDate(dateObject.getDate()+1);
          const correctDate = new Date(dateSum1);
          return db.projects.where('id').equals(currentID).modify( (e) => {
            e.data.scenes[positionInArray][field] = correctDate;
          });
        } if (elem.id === "time" || elem.id === "weather") {
          db.projects.where('id').equals(currentID).modify( (e) => {
            e.data.scenes[positionInArray][field] = elem.value;
          });
        } else {
          db.projects.where('id').equals(currentID).modify( (e) => {
            e.data.scenes[positionInArray][field] = elem.value;
          });
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
        await deleteCard('scenes');
        $( this ).dialog( "close" );
        loadpage('cenas');
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

restoreSceneCard();
restoreCategories('scenes');
restorePOV("#pov_id", "characters");
restorePOV("#place_id", "world");