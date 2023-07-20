/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-var
document.getElementById('main-header').style.display = 'block';

function getStatusColor(status) {
  switch (status) {
    case 'em andamento':
      return '#437895';
    case 'pausado':
      return 'chocolate';
    case 'concluído':
      return 'green';
    default:
      return 'gray';
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

async function structureDraft() {
  const project = await getCurrentProject();
  const newProject = { ...project };
  newProject.data.chapters.forEach((chapter) => {
    // eslint-disable-next-line no-param-reassign
    chapter.scenes = chapter.scenes
      .map((sceneId) => newProject.data.scenes.find((scene) => scene.id === sceneId));
  });
  newProject.data.parts.forEach((part) => {
    // eslint-disable-next-line no-param-reassign
    part.chapters = part.chapters
      .map((chapterId) => newProject.data.chapters.find((chapter) => chapter.id === chapterId));
  });
  return newProject.data.parts;
}

function sumWordCount(worcunt) {
  const wordCountMap = {};
  worcunt.forEach((item) => {
    const { ChapTitle, wordcount } = item;
    if (wordCountMap[ChapTitle]) {
      wordCountMap[ChapTitle] += wordcount;
    } else {
      wordCountMap[ChapTitle] = wordcount;
    }
  });
  return Object.values(wordCountMap);
}

async function getChaptersSum() {
  const wordsSenes = [];
  const data = await structureDraft();
  for (let index = 0; index < data.length; index += 1) {
    const element = data[index];
    const elechapters = element.chapters;
    for (let ind = 0; ind < elechapters.length; ind += 1) {
      const element2 = elechapters[ind];
      const ChapTitle = element2.title;
      const elescenes = element2.scenes;
      for (let i = 0; i < elescenes.length; i += 1) {
        const element3 = elescenes[i];
        if (element3.content_full) {
          const conteudoCompleto = element3.content_full;
          const textoLimpo = conteudoCompleto.trim().replace(/\s+/g, ' ');
          const palavras = textoLimpo.split(' ');
          wordsSenes.push({ ChapTitle, wordcount: palavras.length });
        }
      }
    }
  }
  const result = sumWordCount(wordsSenes);
  return result;
}

function chartScene(amount, itentsPosition, divID) {
  const ctx = document.getElementById(divID).getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: itentsPosition,
      datasets: [{
        label: 'Palavras',
        data: amount,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(40,40,40,1)' },
        },
        x: {
          grid: { color: 'rgba(40,40,40,1)' },
        },
      },
    },
  });
  chart.render();
}

function calcSumSceneChap(scenes, charID) {
  const resultSorted = sortByKey(scenes, 'position');
  let totalPalavras = 0;
  const amount = [];
  const itentsPosition = [];
  for (let i = 0; i < resultSorted.length; i += 1) {
    const scene = resultSorted[i];
    if (Object.prototype.hasOwnProperty.call(scene, 'content_full')) {
      const conteudoCompleto = scene.content_full;
      const textoLimpo = conteudoCompleto.trim().replace(/\s+/g, ' ');
      const palavras = textoLimpo.split(' ');
      amount.push(palavras.length);
      totalPalavras += palavras.length;
    }
    itentsPosition.push(i + 1);
  }
  chartScene(amount, itentsPosition, charID);
  const formattedValue = totalPalavras.toLocaleString('pt-BR');
  document.getElementById('totalPalavras').innerText = formattedValue;
  return totalPalavras;
}

async function calcSumChap(scenes, charID) {
  const resultSorted = sortByKey(scenes, 'position');
  const amount = await getChaptersSum();
  const itentsPosition = [];
  for (let i = 0; i < resultSorted.length; i += 1) {
    itentsPosition.push(i + 1);
  }
  chartScene(amount, itentsPosition, charID);
  return true;
}

function calcSumCharWorld(scenes, charID) {
  let totalPalavras = 0;
  const amount = [];
  const itentsPosition = [];
  for (let i = 0; i < scenes.length; i += 1) {
    const scene = scenes[i];
    if (Object.prototype.hasOwnProperty.call(scene, 'content')) {
      const conteudoCompleto = scene.content;
      const textoLimpo = conteudoCompleto.trim().replace(/\s+/g, ' ');
      const palavras = textoLimpo.split(' ');
      amount.push(palavras.length);
      itentsPosition.push(i + 1);
      totalPalavras += palavras.length;
    }
  }
  chartScene(amount, itentsPosition, charID);
  return totalPalavras;
}

function getDashCardInfos(data, idQtd) {
  if (idQtd === 'cardsDashboard_scenes_qtd') {
    calcSumSceneChap(data, 'myChartScenes');
  } if (idQtd === 'cardsDashboard_structure_qtd') {
    calcSumChap(data, 'myChartChap');
  } if (idQtd === 'cardsDashboard_characters_qtd') {
    calcSumCharWorld(data, 'myChartChar');
  } if (idQtd === 'cardsDashboard_mundo_qtd') {
    calcSumCharWorld(data, 'myChartWorld');
  }
  const qtdWorld = data.length;
  // totalCards += qtdWorld;
  document.getElementById(idQtd).innerText = qtdWorld;
}

// =====================================================

function addBackgroundProject(time, placeID) {
  if (time) {
    const mainDiv = document.getElementById(placeID);
    const resultImg = `url('${time}')`;
    mainDiv.style.backgroundImage = resultImg;
    mainDiv.style.backgroundRepeat = 'no-repeat';
    mainDiv.style.backgroundSize = 'cover';
    mainDiv.style.width = '100%';
    mainDiv.style.backgroundColor = '#202024';
  } else {
    const mainDiv = document.getElementById(placeID);
    mainDiv.style.backgroundImage = '';
    mainDiv.classList.remove('sombras');
  }
}

function diasDecorridos(data) {
  const hoje = new Date();
  const dataInicio = new Date(data);
  const diffTime = dataInicio - hoje;
  if (diffTime > 0) {
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { remain: `faltam ${diffDays} dias para o início` };
  }
  const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
  return { remain: `${diffDays} dias decorridos` };
}

function calcularProgresso(startDate, finishDate) {
  if (!startDate && !finishDate) {
    return { remain: 'sem dadas' };
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
  let finalRemain = '';
  if (daysRemaining <= 0) {
    finalRemain = 'Prazo encerrado';
  } else if (daysRemaining === 1) {
    finalRemain = 'Último dia';
  } else {
    finalRemain = `${daysRemaining} dias restantes`;
  }
  return {
    porcent: `${percentageElapsedRounded}%`,
    remain: finalRemain,
  };
}

function addInfosHtml(data) {
  document.getElementById('project-title-dashboard').innerText = data.title;
  document.getElementById('project-subtitle').innerHTML = `<h2>${data.subtitle}</h2>`;
  if (data.showSubtitle) {
    document.getElementById('project-subtitle').style.display = 'block';
  }
  document.getElementById('project-type-dashboard').innerText = data.literary_genre;
  const label = document.getElementById('project-status-dashboard');
  label.innerText = data.status;
  label.style.fontSize = '1rem';
  changeLabelColor(data.status);
  document.getElementById('project-resume').innerText = data.description;

  // Progressbar section
  if (data.deadline) {
    document.getElementById('sectionDeadline').style.display = 'block';
  }
  const resultTime = calcularProgresso(data.startDate, data.finishDate);
  const startDateBR = convertDatePTBR(data.startDate);
  document.getElementById('startDate').innerText = data.startDate ? startDateBR : 'sem dada';
  const finishDateBR = convertDatePTBR(data.finishDate);
  document.getElementById('finishDate').innerText = data.finishDate ? finishDateBR : 'sem prazo';
  document.getElementById('daysRemaining').innerText = resultTime.remain;
  document.getElementById('progressBarColor').style.width = resultTime.porcent;

  getDashCardInfos(data.data.world, 'cardsDashboard_mundo_qtd', 'cardsDashboard_mundo');
  getDashCardInfos(data.data.characters, 'cardsDashboard_characters_qtd', 'cardsDashboard_characters');
  getDashCardInfos(data.data.scenes, 'cardsDashboard_scenes_qtd', 'cardsDashboard_scenes');
  getDashCardInfos(data.data.chapters, 'cardsDashboard_structure_qtd', 'cardsDashboard_structure');
  const totalCards = getQtyCards(data.data);
  document.getElementById('totalcards').innerText = totalCards;
  addBackgroundProject(data.image_cover, 'Dashboard-content');
}

async function recoverProjectInfos() {
  const projectActual = await db.settings.toArray();
  const idProject = await projectActual[0].currentproject;
  const projectData = await db.projects.get(idProject);
  addInfosHtml(projectData);
}
recoverProjectInfos();

function returnDomainName(table) {
  switch (table) {
    case 'characters':
      return { name: 'Personagem', img: '../../assets/icons/characters.png' };
    case 'world':
      return { name: 'Mundo', img: '../../assets/icons/world.png' };
    case 'scenes':
      return { name: 'Cena', img: '../../assets/icons/scenes.png' };
    case 'chapters':
      return { name: 'Capítulo', img: '../../assets/icons/structure.png' };
    case 'parts':
      return { name: 'Parte', img: '../../assets/icons/structure.png' };
    case 'timeline':
      return { name: 'Timeline', img: '../../assets/icons/timeline.png' };
    case 'notes':
      return { name: 'Notas', img: '../../assets/icons/notes.png' };
    default:
      return null;
  }
}

function returnPageName(table) {
  switch (table) {
    case 'characters':
      return { pagename: 'personagens', detailPage: 'detailCharacter' };
    case 'world':
      return { pagename: 'mundo', detailPage: 'world' };
    case 'scenes':
      return { pagename: 'cenas', detailPage: 'detailScene' };
    case 'chapters':
      return { pagename: 'estrutura', detailPage: 'detailChapter' };
    case 'parts':
      return { pagename: 'estrutura', detailPage: 'detailPart' };
    case 'timeline':
      return { pagename: 'timeline', detailPage: 'detailTimeline' };
    case 'notes':
      return { pagename: 'notas', detailPage: 'detailNote' };
    default:
      return null;
  }
}

async function restorelastEditCards() {
  const project = await getCurrentProject();
  if (project.recent_edits.length === 0) {
    return $('#lastCards').append('<div><p>No momento não existem cartões</p></div>');
  }
  project.recent_edits.reverse().forEach((ele, i) => {
    const icon = returnDomainName(ele.table);
    const page = returnPageName(ele.table);
    const cardItem = project.data[ele.table].filter((item) => item.id === ele.id);
    return $('#lastCards').append(
      `
      <div style="margin-top: 5px">
        <div class="imgLastEditItem">
          <img src=${icon.img} style='width: 25px;'>
        </div>
        <div>
          ${cardItem[0].category ? cardItem[0].category : icon.name}
          <a class="lastEditTitle" onclick="loadpageDetail('${cardItem[0].category === 'Listas' ? 'detailList' : page.detailPage}')">
            <div data-testid="recent-card-${i}" onclick="setCurrentCard('${ele.table}', ${ele.id})">
            ${cardItem[0].title}
            </div>
          </a>
        </div>
      </div>
      <div class="dashboard-divisor2"></div>
      `,
    );
  });
  return null;
}

restorelastEditCards();
calcularTempoPassado();
onscrollUpAndDown();
restoreNavBar();
