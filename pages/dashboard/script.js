console.log('chamou dashboard');

async function recoverProjectInfos() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  // const title = projectData.title;
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
  console.log(colorResult, color);
  const sheet = document.styleSheets[0];
  sheet.insertRule(`#labelRibbon { background-color: ${colorResult}; }`, sheet.cssRules.length);
  sheet.insertRule(`#labelRibbon:before { background-color: ${colorResult}; }`, sheet.cssRules.length);
  sheet.insertRule(`#labelRibbon:after { background-color: ${colorResult}; }`, sheet.cssRules.length);
}

// =====================================================

function changeBackgroundImages(images, id) {
  if (!images || images.length === 0) {
    return;
  }
  // const container = document.querySelector('.container');
  const container = document.getElementById(id);
  let backgroundImageUrls = '';
  for (let i = 0; i < images.length; i++) {
    backgroundImageUrls += `url(${images[i]})`;
    if (i !== images.length - 1) {
      backgroundImageUrls += ', ';
    }
  }
  container.style.backgroundImage = backgroundImageUrls;
}

function extractImageCards(array) {
  const imageCards = [];
  for (let i = 0; i < array.length; i++) {
    const { image_card } = array[i];
    if (image_card) {
      imageCards.push(image_card);
    }
  }
  return imageCards;
}

// =====================================================


function addInfosHtml(data) {
  document.getElementById("project-title-dashboard").innerText = data.title
  document.getElementById("project-type-dashboard").innerText = data.literary_genre
  const label = document.getElementById("project-status-dashboard");
  label.innerText = data.status;
  label.style.fontSize = '1rem';
  changeLabelColor(data.status);
  document.getElementById("project-resume").innerText = data.description;

  const qtdWorld = data.data.world.length;
  document.getElementById("cardsDashboard_mundo_qtd").innerText = qtdWorld;
  const imgsWorld = extractImageCards(data.data.world)
  changeBackgroundImages(imgsWorld, 'cardsDashboard_mundo')


  $('#dinamic').append(
    `
    <h2>${data.title}</h2>
    <img id="imageid" src="${ !data.image_cover ? 'assets/images/manuscript.jpeg' : data.image_cover }" class="coverImage" width="300">
    <div>
    <input type="button" value="Editar" onclick="pageChange('#dinamic', 'components/projects/editProject.html', 'components/projects/script.js')">
    </div>
    `
  )
};

async function setBackground() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  if (projectData.image_cover) {
    document.body.style.backgroundImage = `url('${projectData.image_cover}')`;
  } else {
    restoreBackground() 
  }
};
setBackground();
