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
    console.log(ele.value);
    if (ele.value !== "" && ele.value !== "SALVAR" && ele.type !== "radio") result = result + 1;
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


// Get the modal
var modal = document.getElementById("myModal");

function addItemModal() {
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function saveNewItem() {
  const idDetail = localStorage.getItem("detail");
  const obj = { oldKey: modalForm.typeItem.value };
  obj[modalForm.nameItem.value] = obj['oldKey'];
  delete obj['oldKey'];

  db.characters.update(Number(idDetail), obj)
}
