 async function DetailCharData() {
  const idDetail = localStorage.getItem("detail");
  const person = await db.characters.get({ id: Number(idDetail) });

  const dateBR = convertDateBR(person.birth)
  $('#details').append(
    `
    <h2>${person.name}</h2>
    <p>${person.type}</p>
    <p>${person.resume}</p>
    <p>Idade:</p>
    <i>${person.age}</i>
    <p>Nascimento:</p>
    <p>${dateBR}</p>
    `
  )
};
DetailCharData();

async function deleteChar() {
  const idDetail = localStorage.getItem("detail");
  const response = confirm("Excluir personagem?")
  if (response === true) {
    db.characters.delete(Number(idDetail));
    pageChange(
      '#dinamicPage',
      'pages/personagens/page.html',
      'pages/personagens/script.js'
      )
  };
}