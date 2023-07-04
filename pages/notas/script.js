/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
changeTabColor('notas');

function categoryReservedName(name) {
  return name === 'Listas';
}

async function createNewNote() {
  const ID = await idManager('id_notes');
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID();
  const noteName = document.getElementById('noteName');
  const data = {
    title: noteName.value,
    content: '',
    category: '',
    image_card: '',
    links: [],
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.notes.push(data);
  });
  await updateLastEditList('notes', ID);
  await db.projects.update(pjID, { last_edit: currentDate, timestamp: timeStamp });
}

// eslint-disable-next-line no-unused-vars
async function createNewNoteList() {
  const ID = await idManager('id_notes');
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year.toString()}`;
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID();
  const data = {
    title: `Nova Lista (${formattedDate})`,
    content: '',
    category: 'Listas',
    id: ID,
  };
  await db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.notes.push(data);
  });
  await updateLastEditList('notes', ID);
  await db.projects.update(pjID, { last_edit: currentDate, timestamp: timeStamp });
  return pageChange('#dinamic', 'pages/notas/page.html', 'pages/notas/script.js');
}

$('#dialogNotes').dialog({
  autoOpen: false,
  width: 600,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-notes',
      disabled: false,
      async click() {
        await createNewNote();
        $(this).dialog('close');
        document.getElementById('noteName').value = '';
        pageChange('#dinamic', 'pages/notas/page.html', 'pages/notas/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('noteName').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog
$('#dialog-link-note').click((event) => {
  $('#dialogNotes').dialog('open');
  $('#okBtn-notes').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('noteName').value = '';
  });
  event.preventDefault();
});
validateNewCard('noteName', '#okBtn-notes');

$('#dialog_new_noteCategory').dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-cat-note',
      disabled: false,
      async click() {
        const cat = document.getElementById('categoryNoteName');
        const check = categoryReservedName(cat.value);
        if (check) {
          return alert('Categoria Listas já existe! Escolha outro nome.');
        }
        await addNewCategory('notes', cat.value);
        $(this).dialog('close');
        document.getElementById('categoryNoteName').value = '';
        return pageChange('#dinamic', 'pages/notas/page.html', 'pages/notas/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('categoryNoteName').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog Category
$('#dialog-link-category-note').click((event) => {
  $('#dialog_new_noteCategory').dialog('open');
  $('#okBtn-cat-note').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('categoryNoteName').value = '';
  });
  event.preventDefault();
});
validateNewCard('categoryNoteName', '#okBtn-cat-note');

$('#dialog_delete_noteCategory').dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-delcat-note',
      disabled: false,
      async click() {
        const catDel = document.getElementById('categoryDelNoteName');
        await removeCategory('notes', catDel.value);
        $(this).dialog('close');
        document.getElementById('categoryDelNoteName').value = '';
        pageChange('#dinamic', 'pages/notas/page.html', 'pages/notas/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('categoryDelNoteName').value = '';
        $(this).dialog('close');
      },
    }],
});
$('#dialog-link-delcategory-note').click((event) => {
  $('#dialog_delete_noteCategory').dialog('open');
  $('#okBtn-delcat-note').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('categoryDelNoteName').value = '';
  });
  restoreDelCategories('notes', '#categoryDelNoteName');
  event.preventDefault();
});
validateNewCard('categoryDelNoteName', '#okBtn-delcat-note');

function removeListClass() {
  const itens = document.querySelectorAll('.selected');
  for (let i = 0; i < itens.length; i += 1) {
    itens[i].classList.remove('selected');
  }
}

function createLinksCards(links, divID) {
  const linksDiv = document.getElementById(divID);
  links.forEach((link, i) => {
    const anchor = document.createElement('a');

    anchor.innerHTML = `<p style='margin-bottom: 10px'><a href='${link.address}' target="_blank">  ${link.title}🡽<a/></p>`;
    linksDiv.appendChild(anchor);
  });
}

async function getNotesCards() {
  const project = await getCurrentProject();
  const sortBy = localStorage.getItem('sortNotes');
  let resultSorted = sortByKey(project.data.notes, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>");
  }
  if (sortBy === 'ZA') {
    resultSorted = resultSorted.reverse();
    document.getElementById('sortDescending').disabled = true;
    document.getElementById('sortAscending').disabled = false;
  } else {
    document.getElementById('sortDescending').disabled = false;
    document.getElementById('sortAscending').disabled = true;
  }
  resultSorted.forEach((ele, i) => {
    if (ele.category === 'Listas') {
      return $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens" id='${ele.id}'>
          <a data-testid='note-item-${ele.id}' onclick="loadpageOnclick('notes', ${ele.id}, '#dinamic', 'components/detailList/page.html', 'components/detailList/script.js')">
            <div class="worldName">
              <div class="contentListWorld">
                <p class="wordlTitle">${ele.title}</p>
                <hr class="cardLineTop">
                <span> ${ele.category} </span>
                <div class="worldCardDivider">
                  <div>
                    <div class="it">${ele.content}</div>
                  </div>
                </div>
              </div>
            </div>
          </a>
          </li>
        </ul>
        `,
      );
    } if (ele.links?.length > 0) {
      $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens" id='${ele.id}'>
          <a data-testid='note-item-${ele.id}' onclick="loadpageOnclick('notes', ${ele.id}, '#dinamic', 'components/detailNote/page.html', 'components/detailNote/script.js')">
            <div class="worldName">
              <div class="contentListWorld">
                <p class="wordlTitle">${ele.title}</p></a>
                <hr class="cardLineTop">
                <span> ${ele.category} </span>
                <div class="worldCardDivider">
                <div>

                    <div id='links+${i}' class='linksList'></div>
                <a onclick="loadpageOnclick('notes', ${ele.id}, '#dinamic', 'components/detailNote/page.html', 'components/detailNote/script.js')">
                    <p class="it">${ele.content}</p>
                  </div>
                  <div>
                    ${!ele.image_card ? '' : `<img src='${ele.image_card}'class="linkImage"></img>`}
                  </div>
                </div>
              </div>
            </div>
          </a>
          </li>
        </ul>
        `,
      );
      return createLinksCards(ele.links, `links+${i}`);
    } $('#project-list').append(
      `
      <ul class="worldList">
        <li class="worldItens" id='${ele.id}'>
        <a data-testid='note-item-${ele.id}' onclick="loadpageOnclick('notes', ${ele.id}, '#dinamic', 'components/detailNote/page.html', 'components/detailNote/script.js')">
          <div class="worldName">
            <div class="contentListWorld">
              <p class="wordlTitle">${ele.title}</p>
              <hr class="cardLineTop">
              <span> ${ele.category} </span>
              <div class="worldCardDivider">
                <div>
                  <p class="it">${ele.content}</p>
                </div>
                <div>
                  ${!ele.image_card ? '' : `<img src='${ele.image_card}'class="linkImage"></img>`}
                </div>
              </div>
            </div>
          </div>
        </a>
        </li>
      </ul>
      `,
    );
    setContentOpacity();
    return removeListClass();
  });
  return null;
}

async function getNotesCardsFilter(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const sortBy = localStorage.getItem('sortNotes');
  let resultSorted = sortByKey(project.data.notes, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>");
  }
  if (sortBy === 'ZA') {
    resultSorted = resultSorted.reverse();
  }
  resultSorted.forEach((ele, i) => {
    if (ele.category === filter) {
      if (ele.category === 'Listas') {
        return $('#project-list').append(
          `
          <ul class="worldList">
            <li class="worldItens" id='${ele.id}'>
            <a data-testid='note-item-${ele.id}' onclick="loadpageOnclick('notes', ${ele.id}, '#dinamic', 'components/detailList/page.html', 'components/detailList/script.js')">
              <div class="worldName">
                <div class="contentListWorld">
                  <p class="wordlTitle">${ele.title}</p>
                  <hr class="cardLineTop">
                  <span> ${ele.category} </span>
                  <div class="worldCardDivider">
                    <div>
                      <div class="it">${ele.content}</div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            </li>
          </ul>
          `,
        );
      } if (ele.links?.length > 0) {
        $('#project-list').append(
          `
          <ul class="worldList">
            <li class="worldItens" id='${ele.id}'>
            <a data-testid='note-item-${ele.id}' onclick="loadpageOnclick('notes', ${ele.id}, '#dinamic', 'components/detailNote/page.html', 'components/detailNote/script.js')">
              <div class="worldName">
                <div class="contentListWorld">
                  <p class="wordlTitle">${ele.title}</p></a>
                  <hr class="cardLineTop">
                  <span> ${ele.category} </span>
                  <div class="worldCardDivider">
                  <div>
  
                      <div id='links+${i}' class='linksList'></div>
                  <a onclick="loadpageOnclick('notes', ${ele.id}, '#dinamic', 'components/detailNote/page.html', 'components/detailNote/script.js')">
                      <p class="it">${ele.content}</p>
                    </div>
                    <div>
                      ${!ele.image_card ? '' : `<img src='${ele.image_card}'class="linkImage"></img>`}
                    </div>
                  </div>
                </div>
              </div>
            </a>
            </li>
          </ul>
          `,
        );
        return createLinksCards(ele.links, `links+${i}`);
      } $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens" id='${ele.id}'>
          <a data-testid='note-item-${ele.id}' onclick="loadpageOnclick('notes', ${ele.id}, '#dinamic', 'components/detailNote/page.html', 'components/detailNote/script.js')">
            <div class="worldName">
              <div class="contentListWorld">
                <p class="wordlTitle">${ele.title}</p>
                <hr class="cardLineTop">
                <span> ${ele.category} </span>
                <div class="worldCardDivider">
                  <div>
                    <p class="it">${ele.content}</p>
                  </div>
                  <div>
                    ${!ele.image_card ? '' : `<img src='${ele.image_card}'class="linkImage"></img>`}
                  </div>
                </div>
              </div>
            </div>
          </a>
          </li>
        </ul>
        `,
      );
    }
    setContentOpacity();
    return removeListClass();
  });
  return null;
}

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getNotesCardsFilter(filterCategory);
}

getNotesCards();
setCustomTabs('notes');
