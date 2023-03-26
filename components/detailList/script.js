
  const selectItem = document.getElementById('lista-tarefas');

  function newTask() {
    const li = document.createElement('li');
    const newItem = document.getElementById('texto-tarefa').value;
    const ol = document.getElementById('lista-tarefas');
    li.innerText = newItem;
    ol.appendChild(li);
    document.getElementById('texto-tarefa').value = '';
  }
  
  function clearAll() {
    const liSecelt = document.querySelectorAll('li');
    for (let i = 0; i < liSecelt.length; i += 1) {
      selectItem.removeChild(liSecelt[i]);
    }
  }
  
  function clearAllDone() {
    const liSecelt = document.querySelectorAll('.completed');
    for (let i = 0; i < liSecelt.length; i += 1) {
      selectItem.removeChild(liSecelt[i]);
    }
  }
  
  // function saveList() {
  //   const selectLi = document.querySelector('ol').innerHTML;
  //   localStorage.setItem('listItems', selectLi);
  // }
  
  function sendDown() {
    const atual = document.querySelectorAll('li');
    const proximo = document.querySelector('.selected');
    for (let i =0; i < atual.length - 1; i += 1) {
      let teste = atual[i].classList;
      if (teste.contains('selected')) {
        atual[i].parentNode.insertBefore(atual[i].nextSibling, proximo);
      }
    }
  }
  
  function sendUp() {
    const atual = document.querySelectorAll('li');
    const proximo = document.querySelector('.selected');
    for (let i =1; i < atual.length; i += 1) {
      let teste = atual[i].classList;
      if (teste.contains('selected')) {
        atual[i].parentNode.insertBefore(proximo, atual[i].previousSibling);
      }
    }
  }
  function removeSelected() {
    const liSecelt = document.querySelectorAll('.selected');
    for (let i = 0; i < liSecelt.length; i += 1) {
      selectItem.removeChild(liSecelt[i]);
    }
  }
  
  function selectTask(event) {
    const mouseClick = document.querySelectorAll('.selected');
    for (let i = 0; i < mouseClick.length; i += 1) {
      mouseClick[i].classList.remove('selected');
    }
    event.target.classList.add('selected');
  }
  
  function taskDone(event2) {
    const verify = event2.target.classList.contains('completed');
    if (verify === true) {
      event2.target.classList.remove('completed');
    } else {
      event2.target.classList.add('completed');
    }
  }
  
  selectItem.addEventListener('click', selectTask);
  selectItem.addEventListener('dblclick', taskDone);