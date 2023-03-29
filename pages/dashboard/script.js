console.log('chamou dashboard');

async function recoverProjectInfos() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  addInfosHtml(projectData)
};
recoverProjectInfos();

function getStatusColor(status) {
  switch (status) {
    case "em andamento":
      return "#437895";
    case "pausado":
      return "chocolate";
    case "concluído":
      return "green";
    default:
      return "gray";
  }
}

function changeLabelColor(color) {
  const colorResult = getStatusColor(color);
  const sheet = document.styleSheets[0];
  sheet.insertRule(`#labelRibbon { background-color: ${colorResult}; }`, sheet.cssRules.length);
  sheet.insertRule(`#labelRibbon:before { background-color: ${colorResult}; }`, sheet.cssRules.length);
  sheet.insertRule(`#labelRibbon:after { background-color: ${colorResult}; }`, sheet.cssRules.length);
}

// =====================================================
var totalCards = 0;

function changeBackgroundImages(images, id) {
  if (!images || images.length === 0) {
    return;
  }
  const container = document.getElementById(id);
  let backgroundImageUrls = '';
  for (let i = 0; i < images.length; i++) {
    backgroundImageUrls += `url(${images[i]})`;
    if (i !== images.length - 1) {
      backgroundImageUrls += ', ';
    }
  }
  return container.style.backgroundImage = backgroundImageUrls;
}

function extractImageCards(array) {
  const imageCards = [];
  for (let i = 0; i < array.length; i++) {
    const { image_card_mini } = array[i];
    if (image_card_mini) {
      imageCards.push(image_card_mini);
    }
  }
  return imageCards;
}

function getDashCardInfos(data, idQtd, idImg) {
  const qtdWorld = data.length;
  totalCards += qtdWorld
  document.getElementById(idQtd).innerText = qtdWorld;
  const imgsMini = extractImageCards(data)
  return changeBackgroundImages(imgsMini, idImg)
}

// =====================================================

function addBackgroundProject(time, placeID) {
  if (time) {
    const mainDiv = document.getElementById(placeID);
    const resultImg = `url('${time}')`
    mainDiv.style.backgroundImage = resultImg;
    mainDiv.style.backgroundRepeat = "no-repeat";
    mainDiv.style.backgroundSize = "cover";
    mainDiv.style.width = "100%";
    mainDiv.style.backgroundColor  = "#202024";
  } else {
    const mainDiv = document.getElementById(placeID);
    mainDiv.style.backgroundImage = '';
    mainDiv.classList.remove('sombras');
  };
};

function addInfosHtml(data) {
  document.getElementById("project-title-dashboard").innerText = data.title
  document.getElementById("project-type-dashboard").innerText = data.literary_genre
  const label = document.getElementById("project-status-dashboard");
  label.innerText = data.status;
  label.style.fontSize = '1rem';
  changeLabelColor(data.status);
  document.getElementById("project-resume").innerText = data.description;

  getDashCardInfos(data.data.world, 'cardsDashboard_mundo_qtd', 'cardsDashboard_mundo');
  getDashCardInfos(data.data.characters, 'cardsDashboard_characters_qtd', 'cardsDashboard_characters');
  getDashCardInfos(data.data.scenes, 'cardsDashboard_scenes_qtd', 'cardsDashboard_scenes');
  getDashCardInfos(data.data.chapters, 'cardsDashboard_structure_qtd', 'cardsDashboard_structure');
  getDashCardInfos(data.data.timeline, 'cardsDashboard_timeline_qtd', 'cardsDashboard_timeline');
  getDashCardInfos(data.data.notes, 'cardsDashboard_notes_qtd', 'cardsDashboard_notes');

  document.getElementById('totalcards').innerText = totalCards;

  addBackgroundProject(data.image_cover, "Dashboard-content")
};

function returnDomainName(table) {
  switch (table) {
    case 'characters':
      return {name: 'Personagem', img: "../../assets/icons/characters.png"}
    case 'world':
      return {name: 'Mundo', img: "../../assets/icons/world.png"}
    case 'scenes':
      return {name: 'Cena', img: "../../assets/icons/scenes.png"}
    case 'chapters':
      return {name: 'Capítulo', img: "../../assets/icons/structure.png"}
    case 'parts':
      return {name: 'Parte', img: "../../assets/icons/structure.png"}
    case 'timeline':
      return {name: 'Timeline', img: "../../assets/icons/timeline.png"}
    case 'notes':
      return {name: 'Notas', img: "../../assets/icons/notes.png"}
    default:
      break;
  }
};

async function restorelastEditCards() {
  const project = await getCurrentProject();
  if (project.recent_edits.length === 0) {
    return $('#lastCards').append("<div><p>No momento não existem cartões</p></div>")
  }
  project.recent_edits.reverse().forEach( (ele, i) => {
    const icon = returnDomainName(ele.table)
    const cardItem = project.data[ele.table].filter( (item) => item.id === ele.id)
    return $('#lastCards').append(
      `
      <div style="margin-top: 5px">
        <div class="imgLastEditItem">
          <img src=${icon.img}>
        </div>
        <div>
          ${cardItem[0].category? cardItem[0].category : icon.name}
          <div class="lastEditTitle">
            <a>
            ${cardItem[0].title}
            </a>
          </div>
        </div>
      </div>
      <div class="dashboard-divisor2"></div>
      `
    );
  })
};
restorelastEditCards()
