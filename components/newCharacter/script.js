function AddNewCharacter() {
  if (!form.name.value) {
    document.getElementById('name').className = "required_input";
    alert("O campo 'Nome' é obrigatóro")
  } else {

    db.characters
      .add({
        edit: Date.now(),
        name: form.name.value,
        age: form.age.value,
        birth: form.birth.value,
        type: form.type.value,
        resume: form.resume.value
      });
  
    blockPages(true);
    pageChange(
      '#dinamicPage',
      'pages/personagens/page.html',
      'pages/personagens/script.js'
    )
  }
};

function verifyDiscartChanges() {
  let result = 0;
  const elementsArray = document.querySelectorAll("input");
  elementsArray.forEach( (ele) => {
    if (ele.value !== "" && ele.value !== "SALVAR") result = result + 1;
  })
  return result;
};

function hasChanged() {
  const result = verifyDiscartChanges();
  if (result > 0) {
    let leave = confirm("Sair sem salvar?")
    if (leave === true) {
      blockPages(true);
      pageChange(
        '#dinamicPage',
        'pages/personagens/page.html',
        'pages/personagens/script.js'
        )
    }
  } else {
    blockPages(true);
    pageChange(
      '#dinamicPage',
      'pages/personagens/page.html',
      'pages/personagens/script.js'
      )
  }
}

function blockPages(status) {
  const pages = document.querySelectorAll(".navtrigger");
  if (status) {
    pages.forEach( ele => {
      ele.disabled = false
    })
  } else {
    pages.forEach( ele => {
      ele.disabled = true
    })
  }
}
blockPages(false)