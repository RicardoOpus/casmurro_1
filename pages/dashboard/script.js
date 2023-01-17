console.log('chamou dashboard');

async function recoverProjectInfos() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  // const title = projectData.title;
  addInfosHtml(projectData)
};
recoverProjectInfos();

function addInfosHtml(data) {
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
    // var teste = document.querySelectorAll("body")
    document.body.style.backgroundImage = `url('${projectData.image_cover}')`;
  } else {
    restoreBackground() 
  }
};
setBackground();
