async function restoreCharData() {
  const idDetail = localStorage.getItem("detail");
  const person = await db.characters.get({ id: Number(idDetail) });
  Object.keys(person).map(key => {
    const result = document.getElementById(key);
    if (result) {
      result.value = person[key];
    }
  })
};
restoreCharData();

var elementsArray = document.querySelectorAll(".charFormInput");

elementsArray.forEach(function(elem) {
  const idDetail = localStorage.getItem("detail");
    elem.addEventListener("input", async () => {
      const obj = { oldKey: elem.value };
      obj[elem.id] = obj['oldKey'];
      delete obj['oldKey'];
      db.characters.update(Number(idDetail), obj);
      const timeStamp = Date.now();
      db.characters.update(Number(idDetail), {edit: timeStamp});
    });
});

document.getElementById('salvar').style.display = 'none';

// as this script use the same html page as newCharacter, this change the button function:
document.getElementById('editDetail').setAttribute("onclick",
  "pageChange('#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js')")
document.getElementById('editDetail').innerHTML = "PRONTO";
