/* eslint-disable quotes */
// /* eslint-disable */
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
    const resultImg = returnUrlImgWeather(time);
    mainDiv.style.backgroundImage = resultImg;
    mainDiv.style.backgroundRepeat = "no-repeat";
    mainDiv.style.backgroundSize = "contain";
    mainDiv.style.width = "100%";
    mainDiv.style.backgroundColor = "#202024";
  } else {
    const mainDiv = document.getElementById(placeID);
    mainDiv.style.backgroundImage = '';
  }
}

function verifyFilter(projectData) {
  const filter = localStorage.getItem('ScenesLastTab');
  const povID = localStorage.getItem('tabScenes');
  const chapID = localStorage.getItem('chapterFilter');
  if (filter === 'POV' && povID !== 'All') {
    const result = projectData.scenes.filter((item) => item.pov_id === povID);
    return result;
  } if (filter === 'CHAPTER') {
    const scenesArray = projectData.chapters.filter((item) => item.id === Number(chapID));
    const ids = scenesArray[0].scenes;
    const result = projectData.scenes.filter((item) => ids.includes(item.id));
    return result;
  }
  return projectData.scenes;
}

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
          const noImg = ["", "Ensolarado", "Seco", "Quente", "Frio", "Úmido", "Vento", "Tempestade de areia", "Normal"]
          if (!noImg.includes(ele[key])) {
            addBackgroundToMainDiv(ele[key], "detail_scene");
          }
          return result.value = ele[key];
        } if (key === "chkExtra1") {
          const divExtra = document.getElementById("info_extra_1");
          if (ele[key] ) {
            const checkExtra = document.getElementById("checkbox-constucao");
            divExtra.removeAttribute("style");
            checkExtra.checked = true;
          }
        } if (key === "chkWCScene") {
          const divExtra = document.getElementById("info_extra_wc");
          if (ele[key] ) {
            const checkExtra = document.getElementById("checkbox-word-goal");
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
  const filter = verifyFilter(projectData.data);
  previousNextPosition(filter, 'scenes', 'detailScene');
  getPOVCard();
  transformSceneToViewer();
};


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

function saveDataScene() {
  const elementsArray = document.querySelectorAll(".projectInputForm");
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
  
}
saveDataScene();

async function deleteScene() {
  await clearDate('scenes');
  await deleteCard('scenes')
}

$( "#dialog-delete-scene" ).dialog({
	autoOpen: false,
	width: 500,
	buttons: [
		{
			text: "Ok",
      id: "btnDelScene",
			click: async function() {
        await deleteScene();
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
  const currentCardID = await getCurrentCardID();
  const positionInArray = await getCurrentCard();
  if (this.checked) {
    fieldDateScene.style.display = 'block';
    fieldDateScene.scrollIntoView({behavior: 'smooth'})
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkDateScene = true;
    });
    const timelineID = await NewTimelineGenericScene('2000-01-01', currentCardID, 'scene');
    return db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].date = timelineID;
    });
  } else {
    clearDate('scenes');
    fieldDateScene.style.display = 'none';
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkDateScene = false;
    });
  }
});

//WordCount scene ==========================>
var wc_scene = document.getElementById('checkbox-word-goal');
var fieldWCScene = document.getElementById('info_extra_wc');
fieldWCScene.classList.add('divExtraInfos');
wc_scene.addEventListener('change', async function() {
  const currentID = await getCurrentProjectID();
  const positionInArray = await getCurrentCard();
  if (this.checked) {
    fieldWCScene.style.display = 'block';
    fieldWCScene.scrollIntoView({behavior: 'smooth'})
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkWCScene = true;
    });
  } else {
    fieldWCScene.style.display = 'none';
    db.projects.where('id').equals(currentID).modify( (e) => {
      e.data.scenes[positionInArray].chkWCScene = false;
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
      id: "btnAddCharScene",
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

async function getPOVCard() {
  const projectData = await getCurrentProject();
  const currentCardID = await getCurrentCardID();
  const scene = projectData.data.scenes.find( (ele) => ele.id === currentCardID);
  const pov = projectData.data.characters.find( (ele) => ele.id === Number(scene.pov_id));
  if (pov) {
    const div = document.getElementById('POVcard');
    div.innerHTML = `<div class='POVpic'><img src="${pov.image_card? pov.image_card : 'assets/images/person.png' }" class="cardScenePOV" onclick="loadpageOnclick('characters', ${ pov.id }, '#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js')"></img></div>
    ${pov.nameFull? `<p>${pov.nameFull}</p>` : ''}
      ${pov.age? `<p>${pov.age} anos</p>` : ''}
      ${pov.category? `<p>${pov.category}</p>` : ''}
      ${pov.gender? `<p>${pov.gender}</p>` : ''}
      ${pov.ocupation? `<p>${pov.ocupation}</p>` : ''}
      ${pov.extra_1? `<p><b>Características físicas:</b> ${pov.extra_1}</p>` : ''}
      ${pov.extra_1_1? `<p><b>Características psicologias:</b> ${pov.extra_1_1}</p>` : ''}
      ${pov.extra_2? `<p><b>Motivação:</b> ${pov.extra_2}</p>` : ''}
      ${pov.extra_2_1? `<p><b>Conflito:</b> ${pov.extra_2_1}</p>` : ''}
      ${pov.extra_2_2? `<p><b>Transformação:</b> ${pov.extra_2_2}</p>` : ''}
      ${pov.extra_3? `<p><b>Interior:</b> ${pov.extra_3}</p>` : ''}
      ${pov.extra_3_1? `<p><b>Exterior:</b> ${pov.extra_3_1}</p>` : ''}
      ${pov.content? `<p>${pov.content}</p>` : ''}
      `
  }
};
