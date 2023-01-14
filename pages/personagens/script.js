console.log("chamou Peronagens");

function toList() {
  db.characters
    .each(function (character) {
      const dateBR = convertDateBR(character.birth)
      $('#characters-list').append(
        `
          <tbody>
            <tr key=${character.name}>
              <td><a onclick="detailChar(${character.id})">${character.name}</a></td>
              <td>${character.age}</td>
              <td>${dateBR}</td>
              <td>${character.type}</td>
              <td>${character.resume}</td>
            </tr>
          </tbody>
        `
      );
    })
}
// toList();

function detailChar(id) {
  localStorage.setItem("detail", id);
  pageChange('#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js');
}

changeTabColor("personagens");
