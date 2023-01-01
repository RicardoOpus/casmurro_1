console.log("chamou script página de novo personagem");
const newBtn = document.getElementById('new');
newBtn.style.display = 'none';

// const area = document.getElementById('name')

function AddNewCharacter() {
  if (!form.name.value) {
    document.getElementById('name').className = "required_input";
    alert("O campo 'Nome' é obrigatóro")
  } else {
    db.characters
      .add({
        name: form.name.value,
        age: form.age.value,
        birth: form.birth.value,
        type: form.type.value,
        resume: form.resume.value
      });
  
    $("#dinamicPage").load("pages/personagens/page.html", function () {
      $.getScript("pages/personagens/script.js", function () {
      });
    });
  }
};
