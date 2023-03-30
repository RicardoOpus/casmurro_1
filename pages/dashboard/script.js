console.log('chamou dashboard');

async function recoverProjectInfos() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  addInfosHtml(projectData)
};
recoverProjectInfos();

function getStatusColor(status) {
  switch (status) {
    case "em andamento":
      return "#437895";
    case "pausado":
      return "chocolate";
    case "concluído":
      return "green";
    default:
      return "gray";
  }
}

function changeLabelColor(color) {
  const colorResult = getStatusColor(color);
  const sheet = document.styleSheets[0];
  sheet.insertRule(`#labelRibbon { background-color: ${colorResult}; }`, sheet.cssRules.length);
  sheet.insertRule(`#labelRibbon:before { background-color: ${colorResult}; }`, sheet.cssRules.length);
  sheet.insertRule(`#labelRibbon:after { background-color: ${colorResult}; }`, sheet.cssRules.length);
}

// =====================================================
var totalCards = 0;

function changeBackgroundImages(images, id) {
  if (!images || images.length === 0) {
    return;
  }
  const container = document.getElementById(id);
  let backgroundImageUrls = '';
  for (let i = 0; i < images.length; i++) {
    backgroundImageUrls += `url(${images[i]})`;
    if (i !== images.length - 1) {
      backgroundImageUrls += ', ';
    }
  }
  return container.style.backgroundImage = backgroundImageUrls;
}

function extractImageCards(array) {
  const imageCards = [];
  for (let i = 0; i < array.length; i++) {
    const { image_card_mini } = array[i];
    if (image_card_mini) {
      imageCards.push(image_card_mini);
    }
  }
  return imageCards;
}

function getDashCardInfos(data, idQtd, idImg) {
  const qtdWorld = data.length;
  totalCards += qtdWorld
  document.getElementById(idQtd).innerText = qtdWorld;
  const imgsMini = extractImageCards(data)
  return changeBackgroundImages(imgsMini, idImg)
}

// =====================================================

function addBackgroundProject(time, placeID) {
  if (time) {
    const mainDiv = document.getElementById(placeID);
    const resultImg = `url('${time}')`
    mainDiv.style.backgroundImage = resultImg;
    mainDiv.style.backgroundRepeat = "no-repeat";
    mainDiv.style.backgroundSize = "cover";
    mainDiv.style.width = "100%";
    mainDiv.style.backgroundColor  = "#202024";
  } else {
    const mainDiv = document.getElementById(placeID);
    mainDiv.style.backgroundImage = '';
    mainDiv.classList.remove('sombras');
  };
};

// function diasDecorridos(data) {
//   const hoje = new Date();
//   const dataInicio = new Date(data);
//   const diffTime = Math.abs(hoje - dataInicio);
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return { remain: `${diffDays} dias decorridos` };
// }

function diasDecorridos(data) {
  const hoje = new Date();
  const dataInicio = new Date(data);
  const diffTime = dataInicio - hoje;
  
  if (diffTime > 0) {
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { remain: `faltam ${diffDays} dias para o início` };
  } else {
    const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
    return { remain: `${diffDays} dias decorridos` };
  }
}

function calcularProgresso(startDate, finishDate) {
  if (!startDate && !finishDate) {
    return { remain: `sem dadas` }
  }
  if (!finishDate) {
    return diasDecorridos(startDate);
  }
  const ONE_DAY_IN_MS = 86400000; // quantidade de milissegundos em um dia
  const startDateMs = new Date(startDate).getTime();
  const finishDateMs = new Date(finishDate).getTime();
  const totalDurationMs = finishDateMs - startDateMs;
  const elapsedMs = Date.now() - startDateMs;
  const percentageElapsed = (elapsedMs / totalDurationMs) * 100;
  const percentageElapsedRounded = Math.round(percentageElapsed * 100) / 100;
  const daysRemaining = Math.ceil((finishDateMs - Date.now()) / ONE_DAY_IN_MS);
  console.log(percentageElapsedRounded, finishDate);
  let finalRemain = '';
  if (daysRemaining <= 0) {
    finalRemain = 'Prazo encerrado'
  } else if (daysRemaining === 1) {
    finalRemain = 'Último dia'
  } else {
    finalRemain = daysRemaining + ' dias restantes'
  }
  return {
    porcent: percentageElapsedRounded + '%',
    remain: finalRemain
  };
};

function addInfosHtml(data) {
  document.getElementById("project-title-dashboard").innerText = data.title
  document.getElementById("project-subtitle").innerHTML = `<h2>${ data.subtitle }</h2>` 
  data.showSubtitle? document.getElementById("project-subtitle").style.display = 'block': '';
  document.getElementById("project-type-dashboard").innerText = data.literary_genre
  const label = document.getElementById("project-status-dashboard");
  label.innerText = data.status;
  label.style.fontSize = '1rem';
  changeLabelColor(data.status);
  document.getElementById("project-resume").innerText = data.description;

  // Progressbar section
  data.deadline? document.getElementById("sectionDeadline").style.display = 'block': '';
  const resultTime = calcularProgresso(data.startDate, data.finishDate);
  const startDateBR = convertDatePT_BR(data.startDate);
  document.getElementById('startDate').innerText = data.startDate ? startDateBR : 'sem dada';
  const finishDateBR = convertDatePT_BR(data.finishDate)
  document.getElementById('finishDate').innerText = data.finishDate ? finishDateBR : 'sem prazo';
  document.getElementById('daysRemaining').innerText = resultTime.remain;
  document.getElementById('progressBarColor').style.width = resultTime.porcent;

  getDashCardInfos(data.data.world, 'cardsDashboard_mundo_qtd', 'cardsDashboard_mundo');
  getDashCardInfos(data.data.characters, 'cardsDashboard_characters_qtd', 'cardsDashboard_characters');
  getDashCardInfos(data.data.scenes, 'cardsDashboard_scenes_qtd', 'cardsDashboard_scenes');
  getDashCardInfos(data.data.chapters, 'cardsDashboard_structure_qtd', 'cardsDashboard_structure');
  getDashCardInfos(data.data.timeline, 'cardsDashboard_timeline_qtd', 'cardsDashboard_timeline');
  getDashCardInfos(data.data.notes, 'cardsDashboard_notes_qtd', 'cardsDashboard_notes');

  document.getElementById('totalcards').innerText = totalCards;

  addBackgroundProject(data.image_cover, "Dashboard-content")
};

function returnDomainName(table) {
  switch (table) {
    case 'characters':
      return {name: 'Personagem', img: "../../assets/icons/characters.png"}
    case 'world':
      return {name: 'Mundo', img: "../../assets/icons/world.png"}
    case 'scenes':
      return {name: 'Cena', img: "../../assets/icons/scenes.png"}
    case 'chapters':
      return {name: 'Capítulo', img: "../../assets/icons/structure.png"}
    case 'parts':
      return {name: 'Parte', img: "../../assets/icons/structure.png"}
    case 'timeline':
      return {name: 'Timeline', img: "../../assets/icons/timeline.png"}
    case 'notes':
      return {name: 'Notas', img: "../../assets/icons/notes.png"}
    default:
      break;
  }
};

function returnPageName(table) {
  switch (table) {
    case 'characters':
      return {pagename: 'personagens', detailPage: 'detailCharacter'}
    case 'world':
      return {pagename: 'mundo', detailPage: 'world'};
    case 'scenes':
      return {pagename: 'cenas', detailPage: 'detailScene'};
    case 'chapters':
      return {pagename: 'estrutura', detailPage: 'detailChapter'}
    case 'parts':
      return {pagename: 'estrutura', detailPage: 'detailPart'}
    case 'timeline':
      return {pagename: 'timeline', detailPage: 'detailTimeline'}
    case 'notes':
      return {pagename: 'notas', detailPage: 'detailNote'}
    default:
      break;
  }
};

async function restorelastEditCards() {
  const project = await getCurrentProject();
  if (project.recent_edits.length === 0) {
    return $('#lastCards').append("<div><p>No momento não existem cartões</p></div>")
  }
  project.recent_edits.reverse().forEach( (ele, i) => {
    const icon = returnDomainName(ele.table)
    const page = returnPageName(ele.table)
    const cardItem = project.data[ele.table].filter( (item) => item.id === ele.id)
    return $('#lastCards').append(
      `
      <div style="margin-top: 5px">
        <div class="imgLastEditItem">
          <img src=${icon.img} style='width: 25px;'>
        </div>
        <div>
          ${cardItem[0].category? cardItem[0].category : icon.name}
          <a class="lastEditTitle" onclick="loadpageDetail('${page.pagename}', '${ele.table === 'parts' ? 'project-list' : ele.id}', '${cardItem[0].category === 'Listas' ? 'detailList' : page.detailPage}')">
            <div onclick="setCurrentCard('${ ele.table }', ${ ele.id })">
            ${cardItem[0].title}
            </div>
          </a>
        </div>
      </div>
      <div class="dashboard-divisor2"></div>
      `
    );
  })
};
restorelastEditCards()

// daqui para baixo mandar para script global:

function salvarComoJSON(objeto, nomeArquivo) {
  const texto = JSON.stringify(objeto);
  const data = new Blob([texto], { type: 'application/json' });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.click();
}

async function exportProject() {
  const project = await getCurrentProject();
  salvarComoJSON(project, 'meu_projeto')
}

// =====================================

function getResume() {
  return `
  ██████╗ ███████╗███████╗██╗   ██╗███╗   ███╗ ██████╗
  ██╔══██╗██╔════╝██╔════╝██║   ██║████╗ ████║██╔═══██╗
  ██████╔╝█████╗  ███████╗██║   ██║██╔████╔██║██║   ██║
  ██╔══██╗██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██║   ██║
  ██║  ██║███████╗███████║╚██████╔╝██║ ╚═╝ ██║╚██████╔╝
  ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝

`;
};

function getPersonagens() {
  return `
  ██████╗ ███████╗██████╗ ███████╗ ██████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗███╗   ██╗███████╗
  ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝████╗  ██║██╔════╝
  ██████╔╝█████╗  ██████╔╝███████╗██║   ██║██╔██╗ ██║███████║██║  ███╗█████╗  ██╔██╗ ██║███████╗
  ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██║   ██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██║╚██╗██║╚════██║
  ██║     ███████╗██║  ██║███████║╚██████╔╝██║ ╚████║██║  ██║╚██████╔╝███████╗██║ ╚████║███████║
  ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝

`
}

function getMundo() {
  return `
  ███╗   ███╗██╗   ██╗███╗   ██╗██████╗  ██████╗ 
  ████╗ ████║██║   ██║████╗  ██║██╔══██╗██╔═══██╗
  ██╔████╔██║██║   ██║██╔██╗ ██║██║  ██║██║   ██║
  ██║╚██╔╝██║██║   ██║██║╚██╗██║██║  ██║██║   ██║
  ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██████╔╝╚██████╔╝
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝  ╚═════╝ 

`
}

function getCenas() {
  return `
  ██████╗███████╗███╗   ██╗ █████╗ ███████╗
  ██╔════╝██╔════╝████╗  ██║██╔══██╗██╔════╝
  ██║     █████╗  ██╔██╗ ██║███████║███████╗
  ██║     ██╔══╝  ██║╚██╗██║██╔══██║╚════██║
  ╚██████╗███████╗██║ ╚████║██║  ██║███████║
   ╚═════╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝  

`
}

function getStructure() {
  return `
  ███████╗███████╗████████╗██████╗ ██╗   ██╗████████╗██╗   ██╗██████╗  █████╗ 
  ██╔════╝██╔════╝╚══██╔══╝██╔══██╗██║   ██║╚══██╔══╝██║   ██║██╔══██╗██╔══██╗
  █████╗  ███████╗   ██║   ██████╔╝██║   ██║   ██║   ██║   ██║██████╔╝███████║
  ██╔══╝  ╚════██║   ██║   ██╔══██╗██║   ██║   ██║   ██║   ██║██╔══██╗██╔══██║
  ███████╗███████║   ██║   ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║  ██║██║  ██║
  ╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝

`
}

function getTimeline() {
  return `
  ████████╗██╗███╗   ███╗███████╗██╗     ██╗███╗   ██╗███████╗
  ╚══██╔══╝██║████╗ ████║██╔════╝██║     ██║████╗  ██║██╔════╝
     ██║   ██║██╔████╔██║█████╗  ██║     ██║██╔██╗ ██║█████╗  
     ██║   ██║██║╚██╔╝██║██╔══╝  ██║     ██║██║╚██╗██║██╔══╝  
     ██║   ██║██║ ╚═╝ ██║███████╗███████╗██║██║ ╚████║███████╗
     ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝

`
}

function getNotas() {
  return `
  ███╗   ██╗ ██████╗ ████████╗ █████╗ ███████╗
  ████╗  ██║██╔═══██╗╚══██╔══╝██╔══██╗██╔════╝
  ██╔██╗ ██║██║   ██║   ██║   ███████║███████╗
  ██║╚██╗██║██║   ██║   ██║   ██╔══██║╚════██║
  ██║ ╚████║╚██████╔╝   ██║   ██║  ██║███████║
  ╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝

`
}

function getTextChar(project) {
  const personagnes = project.data.characters;
  const propriedades = ['title', 'category', 'age', 'gender', 'ocupation', 'extra_1', 'extra_1_1', 'extra_2', 'extra_2_1', 'extra_2_2', 'extra_3', 'extra_3_1', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Nome';
            break;
          case 'category':
            nomePropriedade = 'Categoria';
            break;
          case 'age':
            nomePropriedade = 'Idade';
            break;
          case 'gender':
            nomePropriedade = 'Gênero';
            break;
          case 'ocupation':
            nomePropriedade = 'Ocupação';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          case 'extra_1':
            nomePropriedade = 'Características físicas';
            break;
          case 'extra_1_1':
            nomePropriedade = 'Características psicologias';
            break;
          case 'extra_2':
            nomePropriedade = 'Motivação';
            break;
          case 'extra_2_1':
            nomePropriedade = 'Conflito';
            break;
          case 'extra_2_2':
            nomePropriedade = 'Transformação';
            break;
          case 'extra_3':
            nomePropriedade = 'Dualidade - Interior';
            break;
          case 'extra_3_1':
            nomePropriedade = 'Dualidade - Exterior';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextWorld(project) {
  const personagnes = project.data.world;
  const propriedades = ['title', 'category', 'date', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'category':
            nomePropriedade = 'Categoria';
            break;
          case 'date':
            nomePropriedade = 'Data';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextScenes(project) {
  const personagnes = project.data.scenes;
  const propriedades = ['title', 'time', 'status', 'weather', 'content', 'extra_1', 'extra_1-1','extra_1-2','extra_1-3','extra_2','extra_2-1','extra_3', 'extra_3-1', 'extra_3-2', 'content_full'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'time':
            nomePropriedade = 'Período';
            break;
          case 'status':
            nomePropriedade = 'Status';
            break;
          case 'weather':
            nomePropriedade = 'Condições climáticas';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          case 'extra_1':
            nomePropriedade = 'Abertura';
            break;
          case 'extra_1-1':
            nomePropriedade = 'Final';
            break;
          case 'extra_1-2':
            nomePropriedade = 'Pico emocional';
            break;
          case 'extra_1-3':
            nomePropriedade = 'Personagens e agendas';
            break;
          case 'extra_2':
            nomePropriedade = 'Detalhes e realismo';
            break;
          case 'extra_2-1':
            nomePropriedade = 'Interação com o ambiente';
            break;
          case 'extra_3':
            nomePropriedade = 'Revela/esconde';
            break;
          case 'extra_3-1':
            nomePropriedade = 'O leitor deve deduzir';
            break;
          case 'extra_3-2':
            nomePropriedade = 'Símbolos';
            break;
          case 'content_full':
            nomePropriedade = 'Descrição completa';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextParts(project) {
  const personagnes = project.data.parts;
  const propriedades = ['title', 'content', 'content_full'];
  let texto = '';
  texto += '\n__________________ Partes __________________\n'
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'content':
            nomePropriedade = 'Resumo';
            break;
          case 'content_full':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }

  return texto;
}

function getTextChapters(project) {
  const personagnes = project.data.chapters;
  const propriedades = ['title', 'content', 'content_full'];
  let texto = '';
  texto += '\n__________________ Capítulos __________________\n';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'content':
            nomePropriedade = 'Resumo';
            break;
          case 'content_full':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextTimeline(project) {
  const personagnes = sortByDate(project.data.timeline);
  const propriedades = ['date', 'title', 'elementType', 'elementID', 'historicID', 'sceneID', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'date':
            nomePropriedade = 'Data';
            break;
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'elementType':
            nomePropriedade = 'Tipo de evento';
            break;
          case 'elementID':
            nomePropriedade = 'Nome da pessoa';
            break;
          case 'historicID':
            nomePropriedade = 'Fato histórico';
            break;
          case 'sceneID':
            nomePropriedade = 'Cena';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
        if (propriedade === 'historicID') {
          const result = project.data.world.filter((ele) => ele.id === element[propriedade])
          texto += `${result[0].title}\n`;
        } else if (propriedade === 'sceneID') {
          const result = project.data.scenes.filter((ele) => ele.id === element[propriedade])
          texto += `${result[0].title}\n`;
        } else if (propriedade === 'elementID') {
          const result = project.data.characters.filter((ele) => ele.id === element[propriedade])
          texto += `${result[0].title}\n`;
        } else if (element[propriedade] === 'characters-birth'){
          texto += `Nasce personagem: `;
        } else if (element[propriedade] === 'characters-death'){
          texto += `Morre personagem: `;
        } else if (element[propriedade] === 'historical-event'){
          texto += `Fato histórico: `;
        } else if (element[propriedade] === 'scene'){
          texto += `Cena: `;
        } else {
          texto += `${nomePropriedade}: ${element[propriedade]}\n`;
        }
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}

function getTextNotes(project) {
  const personagnes = project.data.notes;
  const propriedades = ['title', 'category', 'content'];
  let texto = '';
  for (let index = 0; index < personagnes.length; index++) {
    const element = personagnes[index];
    for (let i = 0; i < propriedades.length; i++) {
      const propriedade = propriedades[i];
      if (element[propriedade]) {
        let nomePropriedade;
        switch (propriedade) {
          case 'title':
            nomePropriedade = 'Título';
            break;
          case 'category':
            nomePropriedade = 'Categoria';
            break;
          case 'content':
            nomePropriedade = 'Conteúdo';
            break;
          default:
            nomePropriedade = '';
            break;
        }
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = element[propriedade];
          const plainText = tempDiv.innerText;
          texto += `${nomePropriedade}: ${plainText}\n`;
        // texto += `${nomePropriedade}: ${element[propriedade]}\n`;
      }
    }
    texto += '\n-----------------------------------------------------\n';
  }
  return texto;
}


function gerarArquivoTxt(objeto, nomeArquivo) {
  let texto = '';
  for (let chave in objeto) {
    if (typeof objeto[chave] !== 'object') {
      if (chave === 'title') {
        texto += `Título: ${objeto[chave]}\n\n`;
      } else if (chave === 'subtitle') {
        texto += `Subtítulo: ${objeto[chave]}\n\n`;
      } else if (chave === 'status') {
        texto += `Status: ${objeto[chave]}\n\n`;
      } else if (chave === 'literary_genre') {
        texto += `Tipo literário: ${objeto[chave]}\n\n`;
      } else if (chave === 'description') {
        texto += `Resumo: ${objeto[chave]}\n\n`;
      } else if (chave === 'startDate') {
        texto += `Data inicial: ${objeto[chave]}\n`;
      } else if (chave === 'finishDate') {
        texto += `Data final: ${objeto[chave]}\n\n`;
      } else {
        texto += `${objeto[chave]}\n`;
      }
    } 
  }
  basic = getResume() + texto + getPersonagens();
  basicChars = basic + getTextChar(objeto);
  WorldChars = basicChars +  getMundo() + getTextWorld(objeto);
  ScenesWorld = WorldChars +  getCenas() + getTextScenes(objeto);
  StructureScenes = ScenesWorld + getStructure() + getTextParts(objeto) + getTextChapters(objeto);
  TimelineStructure = StructureScenes + getTimeline() + getTextTimeline(objeto);
  NotesAndFinish = TimelineStructure + getNotas() + getTextNotes(objeto)

  const data = new Blob([NotesAndFinish], { type: 'text/plain' });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.click();
}


function clearData1(project) {
  delete project.created_at;
  delete project.id;
  delete project.id_characters;
  delete project.id_notes;
  delete project.id_scenes;
  delete project.id_structure;
  delete project.id_timeline;
  delete project.id_world;
  delete project.image_cover;
  delete project.last_edit;
  delete project.recent_edits;
  delete project.settings;
  delete project.showSubtitle;
  delete project.timestamp;
  // delete project.data;
  return project
}


async function exportProjectText() {
  const project = await getCurrentProject();
  const genre = project.literary_genre ? `(${project.literary_genre})` : ''
  const name = project.title + ' ' + genre + ' - Projeto Casmurro';
  const basicInfos = clearData1(project);
  gerarArquivoTxt(basicInfos, name)
}





