changeTabColor("cenas");

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
  if (time) {
    const mainDiv = document.getElementById(placeID);
    const resultImg = returnUrlImgWeather(time)
    mainDiv.style.backgroundImage = resultImg;
    mainDiv.style.backgroundRepeat = "no-repeat";
    mainDiv.style.backgroundSize = "contain";
    mainDiv.style.width = "100%";
    mainDiv.style.backgroundColor  = "#202024";
  } else {
    const mainDiv = document.getElementById(placeID);
    mainDiv.style.backgroundImage = '';
  };
};

async function restoreSceneCard() {
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  projectData.data.scenes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      Object.keys(ele).forEach(async key => {
        const result = document.getElementById(key);
        if (key === "date" &&  ele[key] !== '') {
          const resultDate = projectData.data.timeline.filter( (timelineElement) => {
            return timelineElement.id === ele[key]
          })
          return result.value = resultDate[0].date;
        } if (key === "time" || key === "weather") {
            const noImg = ["Ensolarado", "Seco", "Quente", "Frio", "Úmido", "Vento", "Tempestade de areia"]
            if (!noImg.includes(ele[key])) {
              addBackgroundToMainDiv(ele[key], "detail_scene")
            }
          return result.value = ele[key];
        } if (key === "chkExtra1") {
          const divExtra = document.getElementById("info_extra_1");
          if (ele[key] ) {
            const checkExtra = document.getElementById("checkbox-constucao");
            divExtra.removeAttribute("style");
            checkExtra.checked = true;
          }
        } if (key === "chkExtra2") {
          const divExtra = document.getElementById("info_extra_2");
          if (ele[key] ) {
            const checkExtra = document.getElementById("checkboxExtra-2");
            divExtra.removeAttribute("style");
            checkExtra.checked = true;
          }
        } if (key === "chkExtra3") {
          const divExtra = document.getElementById("info_extra_3");
          if (ele[key] ) {
            const checkExtra = document.getElementById("checkboxExtra-3");
            divExtra.removeAttribute("style");
            checkExtra.checked = true;
          }
        }  if (key === "chkExtra4") {
          const divExtra = document.getElementById("POVcard");
          if (ele[key] ) {
            const checkExtra = document.getElementById("checkboxExtra-4");
            divExtra.removeAttribute("style");
            checkExtra.checked = true;
          }
        } if (key === "scene_characters") {
          await applyCharScene("#characters_scene", ele[key]);
          ele[key].length === 0 ? document.getElementById('characters_scene').innerHTML = '' : null;
        } if (key === "chkDateScene") {
          const divExtra = document.getElementById("dateSceneDiv");
          if (ele[key] ) {
            const checkExtra = document.getElementById("checkbox-date-scene");
            divExtra.removeAttribute("style");
            checkExtra.checked = true;
          }
        } if (result) {
          return result.value = ele[key];
        }
      })
      resumeHeight("title",
        "content_full", 
        "content",
        "extra_1",
        "extra_1-1",
        "extra_1-2",
        "extra_1-3",
        "extra_2",
        "extra_2-1",
        "extra_3",
        "extra_3-1",
        "extra_3-2"
        );
    } else {
      return null
    }
  })
  previousAndNextScene(projectData.data.scenes);
  getPOVCard();
};

var elementsArray = document.querySelectorAll(".projectInputForm");

document.getElementById('time').addEventListener('change', function() {
  const mainDiv = document.getElementById("weather");
  const noImg = ["Ensolarado", "Seco", "Quente", "Frio", "Úmido", "Vento", "Tempestade de areia", ""]
  !noImg.includes(mainDiv.value) ?  null : addBackgroundToMainDiv(this.value, "detail_scene")
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

// document.getElementById('pov_id').addEventListener('change', async function () {
//   const projectData = await getCurrentProject();
//   const currentCardID = await getCurrentCardID();
//   getPOVCard(projectData, currentCardID);
// });

elementsArray.forEach(async function(elem) {
  const currentID = await getCurrentProjectID();
  const currentCardID = await getCurrentCardID();
  const projectData = await getCurrentProject();
  const positionInArray = await getCurrentCard();
  projectData.data.scenes.forEach( (ele) => {
    if (ele.id === currentCardID) {
      elem.addEventListener("change", async (event) => {
        await lastEditListModify('scenes', currentCardID);
        const field = elem.id
        if (elem.id === "date") {
          const checkIfisNew = await checkTimelineNewDate(ele.id, 'scene', 'sceneID')
          if (checkIfisNew) {
            const projectDataActual = await getCurrentProject();
            const actualIDdate = projectDataActual.data.scenes[positionInArray].date;
            const positionInArrayTime = projectDataActual.data.timeline.map(function (e) { return e.id; }).indexOf(actualIDdate);
            return await db.projects.where('id').equals(currentID).modify( (e) => {
              e.data.timeline[positionInArrayTime].date = elem.value;
            });
          } else {
            const timelineID = await NewTimelineGenericScene(elem.value, ele.id, 'scene');
            return await db.projects.where('id').equals(currentID).modify( (e) => {
              e.data.scenes[positionInArray][field] = timelineID;
            });
          }
        } if (elem.id === "time" || elem.id === "weather") {
          await db.projects.where('id').equals(currentID).modify( (e) => {
            e.data.scenes[positionInArray][field] = elem.value;
          });
        } else {
          await db.projects.where('id').equals(currentID).modify( (e) => {
            e.data.scenes[positionInArray][field] = elem.value;
          });
          getPOVCard();
        }
        updateLastEdit(currentID);
      });
    }
  })
});

$( "#dialog-delete-scene" ).dialog({
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
$( "#deleteSceneCard" ).click(function( event ) {
	$( "#dialog-delete-scene" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

restoreSceneCard();
restoreCategories('scenes');
restorePOV("#pov_id", "characters");
restorePlace("#place_id", "world");

//Date scene ==========================>
var date_scene = document.getElementById('checkbox-date-scene');
var fieldDateScene = document.getElementById('dateSceneDiv');
fieldDateScene.classList.add('divExtraInfos');
date_scene.addEventListener('change', async function() {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  if (this.checked) {
    fieldDateScene.style.display = 'block';
    fieldDateScene.scrollIntoView({behavior: 'smooth'})
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkDateScene = true;
    });
  } else {
    clearDate('scenes');
    fieldDateScene.style.display = 'none';
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkDateScene = false;
    });
  }
});

// Contrução de cena (Extra 1) ==========================>
var checkboxConstrucao = document.getElementById('checkbox-constucao');
var divExtraInfos3 = document.getElementById('info_extra_1');
divExtraInfos3.classList.add('divExtraInfos');
checkboxConstrucao.addEventListener('change', async function() {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  if (this.checked) {
    divExtraInfos3.style.display = 'block';
    divExtraInfos3.scrollIntoView({behavior: 'smooth'})
    resumeHeight("extra_1", "extra_1-1", "extra_1-2", "extra_1-3");
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkExtra1 = true;
    });
  } else {
    divExtraInfos3.style.display = 'none';
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkExtra1 = false;
    });
  }
});

// Contrução de cena (Extra 2) ==========================>
var checkboxExtra3 = document.getElementById('checkboxExtra-2');
var divExtra2 = document.getElementById('info_extra_2');
divExtra2.classList.add('divExtraInfos');
checkboxExtra3.addEventListener('change', async function() {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  if (this.checked) {
    divExtra2.style.display = 'block';
    divExtra2.scrollIntoView({behavior: 'smooth'})
    resumeHeight("extra_2", "extra_2-1");
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkExtra2 = true;
    });
  } else {
    divExtra2.style.display = 'none';
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkExtra2 = false;
    });
  }
});

// Contrução de cena (Extra 3) ==========================>
var checkboxExtra3 = document.getElementById('checkboxExtra-3');
var divExtra3 = document.getElementById('info_extra_3');
divExtra3.classList.add('divExtraInfos');
checkboxExtra3.addEventListener('change', async function() {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  if (this.checked) {
    divExtra3.style.display = 'block';
    divExtra3.scrollIntoView({behavior: 'smooth'})
    resumeHeight("extra_3", "extra_3-1", "extra_3-2");
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkExtra3 = true;
    });
  } else {
    divExtra3.style.display = 'none';
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkExtra3 = false;
    });
  }
});

// Ficha POV (Extra 4) ==========================>
var checkboxExtra4 = document.getElementById('checkboxExtra-4');
var divExtra4 = document.getElementById('POVcard');
checkboxExtra4.addEventListener('change', async function() {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  if (this.checked) {
    divExtra4.style.display = 'block';
    divExtra4.scrollIntoView({behavior: 'smooth'})
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkExtra4 = true;
    });
  } else {
    divExtra4.style.display = 'none';
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkExtra4 = false;
    });
  }
});

async function saveCheckedValues() {
  const form = document.getElementById("chars_scene");
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
    e.data.scenes[positionInArray].scene_characters = checkedValues;
  });
}

$( "#dialog-addCharScene" ).dialog({
	autoOpen: false,
	width: 500,
  maxHeight: 600,
	buttons: [
		{
			text: "Ok",
			click: async function() {
        await saveCheckedValues()
        $( this ).dialog( "close" );
        restoreSceneCard()
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
$( "#btn-addChar" ).click(function( event ) {
	$( "#dialog-addCharScene" ).dialog( "open" );
  $("#btnTwo").focus();
	event.preventDefault();
});

restoreCharScene("#chars_scene", "characters");

async function getChapter() {
  const projectData = await getCurrentProject();
  const currentCardID = await getCurrentCardID();
  const chapters = projectData?.data?.chapters; // Verifica se projectData existe e tem a propriedade data e chapters
  if (Array.isArray(chapters)) { // Verifica se chapters é um array
    chapters.forEach( (ele) => {
      if (ele && ele.scenes && ele.scenes.includes(currentCardID)) { // Verifica se ele existe e tem a propriedade scenes
        document.getElementById('chap_name').innerHTML = `<a onclick="loadpageOnclick('chapters', ${ele.id}, '#dinamic', 'components/detailChapter/page.html', 'components/detailChapter/script.js')"><p>${ele.title}</p></a>`;
      }
    });
  }
};

getChapter()

async function previousAndNextScene(scenes) {
  const positionInArray = await getCurrentCard();
  const nextDiv = document.getElementById('NextScene');
  const prevDiv = document.getElementById('PreviousScene')
  const next = scenes[positionInArray + 1];
  const prev = scenes[positionInArray - 1];
  if (prev) {
    prevDiv.innerHTML = `<p onclick="loadpageOnclick('scenes', ${ prev.id }, '#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')">${prev.title}</p>`
  }
  if (next) {
    nextDiv.innerHTML = `<p onclick="loadpageOnclick('scenes', ${ next.id }, '#dinamic', 'components/detailScene/page.html', 'components/detailScene/script.js')">${next.title}</p>`
  }
};

async function getPOVCard() {
  const projectData = await getCurrentProject();
  const currentCardID = await getCurrentCardID();
  const scene = projectData.data.scenes.find( (ele) => ele.id === currentCardID);
  const pov = projectData.data.characters.find( (ele) => ele.id === Number(scene.pov_id));
  if (pov) {
    console.log('chegou dentro do if', scene, pov);
    const div = document.getElementById('POVcard');
    div.innerHTML = `<div class='POVpic'><img src="${pov.image_card}" class="cardScenePOV" onclick="loadpageOnclick('characters', ${ pov.id }, '#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js')"></img></div>
    ${pov.nameFull? `<p>${pov.nameFull}</p>` : ''}
      ${pov.age? `<p>${pov.age} anos</p>` : ''}
      ${pov.category? `<p>${pov.category}</p>` : ''}
      ${pov.gender? `<p>${pov.gender}</p>` : ''}
      ${pov.ocupation? `<p>${pov.ocupation}</p>` : ''}
      ${pov.extra_1? `<p>Características físicas: ${pov.extra_1}</p>` : ''}
      ${pov.extra_1_1? `<p>Características psicologias: ${pov.extra_1_1}</p>` : ''}
      ${pov.extra_2? `<p>Motivação: ${pov.extra_2}</p>` : ''}
      ${pov.extra_2_1? `<p>Conflito: ${pov.extra_2_1}</p>` : ''}
      ${pov.extra_2_2? `<p>Transformação: ${pov.extra_2_2}</p>` : ''}
      ${pov.extra_3? `<p>Interior: ${pov.extra_3}</p>` : ''}
      ${pov.extra_3_1? `<p>Exterior: ${pov.extra_3_1}</p>` : ''}
      ${pov.content? `<p>${pov.content}</p>` : ''}
      `
  }
};
