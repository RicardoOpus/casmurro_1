// const area = document.getElementById('teste');

// area.addEventListener('input', () => {
//   db.characters.update(4, {name: area.value})
// })

function toList() {
  db.characters
    .each(function (character) {
      $('#characters-list').append(
        `
          <tbody>
            <tr key='${character.name}'>
              <td>${character.name}</td>
              <td>${character.age}</td>
              <td>${character.birth}</td>
              <td>${character.type}</td>
              <td>${character.resume}</td>
            </tr>
          </tbody>
        `
      );
    })
}
toList();

function loadpage () {
  $("#dinamic").load("components/newCharacter/page.html", function () {
    $.getScript("components/newCharacter/script.js", function () {
      });
    });
  }

  $(document).on("click", "#new", function () {
    loadpage();
  })