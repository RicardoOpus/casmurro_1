console.log('chamou dashboard');
async function recoverProjectInfos() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  // const title = projectData.title;
  addInfosHtml(projectData)
}

recoverProjectInfos();

function addInfosHtml(data) {
  $('#dinamic').append(
    `
    <h2>${data.title}</h2>
    <img id="imageid" src="${data.image_cover}" width="300">
    `
  )
}

$("#Header").load("components/navbar/navbar.html", function () {
  $.getScript("components/navbar/script.js", function () {
  });
});

async function saveProjectCover() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  const fileInput = document.querySelector('#my-image');
  const file = fileInput.files[0];
  console.log(file);
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result
    await db.projects.update(projectData.id, {image_cover: base64String})
  };
  reader.readAsDataURL(file);
  pageChange('#dinamicPage', 'pages/dashboard/page.html', 'pages/dashboard/script.js')
}
