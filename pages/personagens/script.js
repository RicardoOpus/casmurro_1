console.log("Chamou Personagens!");
changeTabColor("personagens");

$( "#dialogCharacter" ).dialog({
autoOpen: false,
width: 600,
buttons: [
  {
    text: "Ok",
    id: "okBtn-character",
    disabled: false,
    click: async function() {
      await createNewCharacter();
      $( this ).dialog( "close" );
      document.getElementById("characterName").value = "";
      pageChange('#dinamic', 'pages/personagens/page.html', 'pages/personagens/script.js')
    }
  },
  {
    text: "Cancel",
    click: function() {
      document.getElementById("characterName").value = "";
      $( this ).dialog( "close" );
    }
  }]
});
// Link to open the dialog
$( "#dialog-link-character" ).click(function( event ) {
  $( "#dialogCharacter" ).dialog( "open" );
  $( "#okBtn-character" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("characterName").value = "";
  })
  event.preventDefault();
});

$( "#dialog_new_characterCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-cat",
      disabled: false,
      click: async function() {
        var catChar = document.getElementById("categoryCharName");
        await addNewCategory('characters', catChar.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryCharName").value = "";
        pageChange('#dinamic', 'pages/personagens/page.html', 'pages/personagens/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("categoryCharName").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Category
$( "#dialog-link-category-char" ).click(function( event ) {
  $( "#dialog_new_characterCategory" ).dialog( "open" );
  $( "#okBtn-cat" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryCharName").value = "";
    })
  event.preventDefault();
});

$( "#dialog_delete_characterCategory" ).dialog({
  autoOpen: false,
  width: 400,
  buttons: [
    {
      text: "Ok",
      id: "okBtn-delcat",
      disabled: false,
      click: async function() {
        var catDelChar = document.getElementById("categoryDelName-char");
        await removeCategory('characters', catDelChar.value);
        $( this ).dialog( "close" );
        document.getElementById("categoryDelName-char").value = "";
        pageChange('#dinamic', 'pages/personagens/page.html', 'pages/personagens/script.js')
      }
    },
    {
      text: "Cancel",
      click: function() {
        document.getElementById("categoryDelName-char").value = "";
        $( this ).dialog( "close" );
      }
    }]
});
// Link to open the dialog Delete Category
$( "#dialog-link-delcategory-char" ).click(function( event ) {
  $( "#dialog_delete_characterCategory" ).dialog( "open" );
  $( "#okBtn-delcat" ).addClass( "ui-button-disabled ui-state-disabled" );
  $( ".ui-icon-closethick" ).click(function( event ) {
    document.getElementById("categoryDelName-char").value = "";
    })
  restoreDelCategories('characters', '#categoryDelName-char');
  event.preventDefault();
});

function setFilterCategory(tab, filterCategory) {
  changeInnerTabColor(tab);
  getCharactersCardsFiltred(filterCategory);
}

function checkElement(element) {
  let classes = 'circle ';
  if (
    element.category !== "" && 
    element.gender !== "" &&
    element.date_birth !== "" &&
    element.age !== "" &&
    element.ocupation !== "" &&
    element.content !== ""
  ) {
    classes += "circle1 ";
  } if (
    element.extra_1 && element.extra_1 !== "" &&
    element.extra_1_1 && element.extra_1_1 !== ""
  ) {
    classes += "circle2 ";
  } if (
    element.extra_2 && element.extra_2 !== "" &&
    element.extra_2_1 && element.extra_2_1 !== "" &&
    element.extra_2_2 && element.extra_2_2 !== ""
  ) {
    classes += "circle3 ";
  } if (
    element.extra_3 && element.extra_3 !== "" &&
    element.extra_3_1 && element.extra_3_1 !== ""
  ) {
    classes += "circle4 ";
  }
  return classes;
};

async function getCharactersCards() {
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.characters, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  }
  resultSorted.forEach( (ele) => {
    $('#project-list').append(
      `
      <ul class="worldList">
        <li class="worldItens" id='${ ele.id }'>
        <a onclick="loadpageOnclick('characters', ${ ele.id }, '#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js')">
          <div class="worldName">
            <div class="contentListChar">
          <div class="${checkElement(ele)}"></div>
            <div style='z-index: 1; margin-top: 5px;margin-left: 5px'>
                <img src="${ !ele.image_card ? 'assets/images/person.png' : ele.image_card }" class="charListImage"> 
              </div>
              <div class="charInfos">
                <p class="wordlTitle"><span style="color:${ ele.color }">🯊 </span>${ ele.title }</p>
                <hr class="cardLineTopChar">
                <span> ${ ele.category } ${!ele.age ? '' : ` • ${ele.age} anos`}</span>
                <div class="worldCardDivider">
                  <div>
                    <p class="it">${ ele.content }</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
        </li>
      </ul>
      `
    );
    setContentOpacity();
    setImageOpacity();
  })
};

async function getCharactersCardsFiltred(filter) {
  $('#project-list').empty();
  const project = await getCurrentProject();
  const resultSorted = sortByKey(project.data.characters, 'title');
  if (resultSorted.length === 0) {
    return $('#project-list').append("<div class='cardStructure'><p>No momento não existem cartões.</p><p>Crie cartões no botão (+ Cartão) acima.</p></div>")
  };
  resultSorted.forEach( (ele) => {
    if (ele.category === filter) {
      $('#project-list').append(
        `
        <ul class="worldList">
          <li class="worldItens" id='${ ele.id }'>
          <a onclick="loadpageOnclick('characters', ${ ele.id }, '#dinamic', 'components/detailCharacter/page.html', 'components/detailCharacter/script.js')">
            <div class="worldName">
              <div class="contentListChar">
            <div class="${checkElement(ele)}"></div>
              <div style='z-index: 1; margin-top: 5px;margin-left: 5px'>
                  <img src="${ !ele.image_card ? 'assets/images/person.png' : ele.image_card }" class="charListImage"> 
                </div>
                <div class="charInfos">
                  <p class="wordlTitle"><span style="color:${ ele.color }">🯊 </span>${ ele.title }</p>
                  <hr class="cardLineTopChar">
                  <span> ${ ele.category } ${!ele.age ? '' : ` • ${ele.age} anos`}</span>
                  <div class="worldCardDivider">
                    <div>
                      <p class="it">${ ele.content }</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
          </li>
        </ul>
        `
      );
    }
    setContentOpacity();
    setImageOpacity();
  })
};

async function createNewCharacter() {
  const ID = await idManager('id_characters')
  const currentDate = new Date();
  const timeStamp = Date.now();
  const pjID = await getCurrentProjectID()
  const characterName = document.getElementById("characterName");
  const color = '#8F8F8F';
  const img = "";
  const data = {
    title: characterName.value,
    category: '',
    image_card: img,
    content: '',
    date_birth: '',
    date_death: '',
    gender: '',
    ocupation: '',
    age: '',
    color: color,
    relations: [],
    id: ID
  };
  db.projects.where('id').equals(pjID).modify( (ele) => {
    ele.data.characters.push(data) 
    }
  );
  await updateLastEditList('characters', ID);
  await db.projects.update(pjID,{ last_edit: currentDate,  timestamp: timeStamp });
  return
};

setCustomTabs('characters');
getCharactersCards();
validateNewCard("characterName", "#okBtn-character");
validateNewCard("categoryCharName", "#okBtn-cat");
validateNewCard("categoryDelName-char", "#okBtn-delcat");
