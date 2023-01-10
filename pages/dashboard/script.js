console.log('chamou dashboard');
async function recoverProjectInfos() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  const title = projectData.title;
  addInfosHtml(title)
}

recoverProjectInfos();

function addInfosHtml(data) {
  $('#dinamic').append(
    `
    <h2>${data}</h2>
    `
  )
}

$("#Header").load("components/navbar/navbar.html", function () {
  $.getScript("components/navbar/script.js", function () {
  });
});
