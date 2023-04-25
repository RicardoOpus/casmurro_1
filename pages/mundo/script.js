/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
changeTabColor('mundo');

async function createNewWorld() {
  const ID = await idManager('id_world');
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID();
  const worldName = document.getElementById('worldName');
  const data = {
    title: worldName.value,
    category: '',
    image_card: '',
    content: '',
    date: '',
    id: ID,
  };
  db.projects.where('id').equals(pjID).modify((ele) => {
    ele.data.world.push(data);
  });
  await updateLastEditList('world', ID);
  await db.projects.update(pjID, { last_edit: currentDate, timestamp: timeStamp });
  return saveSorted(pjID, 'world');
}

$('#dialogWorld').dialog({
  autoOpen: false,
  width: 600,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-world',
      disabled: false,
      async click() {
        await createNewWorld();
        $(this).dialog('close');
        document.getElementById('worldName').value = '';
        pageChange('#dinamic', 'pages/mundo/page.html', 'pages/mundo/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('worldName').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog
$('#dialog-link-world').click((event) => {
  $('#dialogWorld').dialog('open');
  $('#okBtn-world').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('worldName').value = '';
  });
  event.preventDefault();
});

$('#dialog_new_worldCategory').dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-cat',
      disabled: false,
      async click() {
        const cat = document.getElementById('categoryName');
        await addNewCategory('world', cat.value);
        $(this).dialog('close');
        document.getElementById('categoryName').value = '';
        pageChange('#dinamic', 'pages/mundo/page.html', 'pages/mundo/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('categoryName').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog Category
$('#dialog-link-category').click((event) => {
  $('#dialog_new_worldCategory').dialog('open');
  $('#okBtn-cat').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('categoryName').value = '';
  });
  event.preventDefault();
});

$('#dialog_delete_worldCategory').dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: 'Ok',
      id: 'okBtn-delcat',
      disabled: false,
      async click() {
        const catDel = document.getElementById('categoryDelName');
        await removeCategory('world', catDel.value);
        $(this).dialog('close');
        document.getElementById('categoryDelName').value = '';
        pageChange('#dinamic', 'pages/mundo/page.html', 'pages/mundo/script.js');
      },
    },
    {
      text: 'Cancel',
      click() {
        document.getElementById('categoryDelName').value = '';
        $(this).dialog('close');
      },
    }],
});
// Link to open the dialog Delete Category
$('#dialog-link-delcategory').click((event) => {
  $('#dialog_delete_worldCategory').dialog('open');
  $('#okBtn-delcat').addClass('ui-button-disabled ui-state-disabled');
  $('.ui-icon-closethick').click(() => {
    document.getElementById('categoryDelName').value = '';
  });
  restoreDelCategories('world', '#categoryDelName');
  event.preventDefault();
});

async function getWorldCards() {
  const project = await getCurrentProject();
  const resultSorted = project.data.world;
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>");
  }
  resultSorted.forEach((ele) => {
    $('#project-list').append(
      `
      <ul class="worldList">
        <li class="worldItens" id='${ele.id}'>
        <a data-testid='card-${ele.id}' onclick="loadpageOnclick('world', ${ele.id}, '#dinamic', 'components/world/page.html', 'components/world/script.js')">
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
                  <img src="${!ele.image_card ? '' : ele.image_card}" class="worldListImage esse"> 
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
    setImageOpacity();
  });
  return null;
}

async function getWorldCardsFiltred(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const resultSorted = project.data.world;
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>");
  }
  resultSorted.forEach((ele) => {
    if (ele.category === filter) {
      $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens">
          <a data-testid='card-${ele.id}' onclick="loadpageOnclick('world', ${ele.id}, '#dinamic', 'components/world/page.html', 'components/world/script.js')">
            <div class="worldName paper">
              <div class="contentListWorld">
                <p class="wordlTitle">${ele.title}</p>
                <hr class="cardLineTop">
                <span> ${ele.category} </span>
                <div class="worldCardDivider">
                  <div>
                    <p class="it">${ele.content}</p>
                  </div>
                  <div>
                    <img src="${!ele.image_card ? '' : ele.image_card}" class="worldListImage esse"> 
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
    setImageOpacity();
  });
  return null;
}

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getWorldCardsFiltred(filterCategory);
}

setCustomTabs('world');
getWorldCards();
validateNewCard('worldName', '#okBtn-world');
validateNewCard('categoryName', '#okBtn-cat');
validateNewCard('categoryDelName', '#okBtn-delcat');
