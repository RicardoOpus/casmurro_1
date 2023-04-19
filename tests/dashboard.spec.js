/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

function removerTextoEntreParenteses(texto) {
  const regex = /\s*\([^)]*\)/g;
  const resultado = texto.replace(regex, '');
  return resultado.trim();
}

describe('Verifica Dashboard', () => {
  let page;

  beforeAll(async () => {
    global.browser = await puppeteer.launch({
      headless: false,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await global.browser.close();
  });

  it('Deve ter 8 botões de navegação', async () => {
    await page.goto('http://127.0.0.1:5500/index.html');
    await page.waitForTimeout(500);
    const newProjectButton = await page.$('#dialog-link');
    await newProjectButton.click();
    await page.waitForSelector('#projectName');
    await page.type('#projectName', 'O Senhor dos Anéis');
    const okButton = await page.$('#okBtn:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);
    const numNavTrigger = await page.$$eval('.navtrigger', (navtriggers) => navtriggers.length);
    expect(numNavTrigger).toBe(8);
  });

  it('Deve haver a quantidade correta no cartão Persongens', async () => {
    const dashboardBtn = await page.$('#dashboard');
    const personagensBtn = await page.$('#personagens');
    await personagensBtn.click();
    await page.waitForSelector('#dialog-link-character');
    const novoCartaoBtn = await page.$('#dialog-link-character');
    await novoCartaoBtn.click();
    await page.waitForSelector('#characterName');
    await page.type('#characterName', 'Frodo Bolseiro');
    const okButton = await page.$('#okBtn-character:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);
    const novoCartaoBtn2 = await page.$('#dialog-link-character');
    await novoCartaoBtn2.click();
    await page.waitForSelector('#characterName');
    await page.type('#characterName', 'Aragorn');
    await okButton.click();
    await page.waitForTimeout(500);
    const novoCartaoBtn3 = await page.$('#dialog-link-character');
    await novoCartaoBtn3.click();
    await page.waitForSelector('#characterName');
    await page.type('#characterName', 'Gollum');
    await okButton.click();
    await dashboardBtn.click();
    await page.waitForTimeout(500);
    const cardCharactersQty = await page.$eval('#cardsDashboard_characters_qtd', (el) => el.innerHTML);
    expect(cardCharactersQty).toBe('3');
  });

  it('Deve haver a quantidade correta no cartão Mundo', async () => {
    const dashboardBtn = await page.$('#dashboard');
    const BtnNew = await page.$('#mundo');
    await BtnNew.click();
    await page.waitForSelector('#dialog-link-world');
    const novoCartaoBtn = await page.$('#dialog-link-world');
    await novoCartaoBtn.click();
    await page.waitForSelector('#worldName');
    await page.type('#worldName', 'O Condado');
    const okButton = await page.$('#okBtn-world:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);
    const BtnNew2 = await page.$('#dialog-link-world');
    await BtnNew2.click();
    await page.waitForSelector('#worldName');
    await page.type('#worldName', 'Andúril');
    await okButton.click();
    await page.waitForTimeout(500);
    const BtnNew3 = await page.$('#dialog-link-world');
    await BtnNew3.click();
    await page.waitForSelector('#worldName');
    await page.type('#worldName', 'A Batalha dos Campos de Pelennor');
    await okButton.click();
    await dashboardBtn.click();
    await page.waitForTimeout(500);
    const cardCharactersQty = await page.$eval('#cardsDashboard_mundo_qtd', (el) => el.innerHTML);
    expect(cardCharactersQty).toBe('3');
  });

  it('Deve haver a quantidade correta no cartão Cenas', async () => {
    const dashboardBtn = await page.$('#dashboard');
    const BtnNew = await page.$('#cenas');
    await BtnNew.click();
    await page.waitForSelector('#dialog-link-scene');
    const novoCartaoBtn = await page.$('#dialog-link-scene');
    await novoCartaoBtn.click();
    await page.waitForSelector('#sceneName');
    await page.type('#sceneName', 'Cena 1');
    const okButton = await page.$('#okBtn-scene:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);
    const BtnNew2 = await page.$('#dialog-link-scene');
    await BtnNew2.click();
    await page.waitForSelector('#sceneName');
    await page.type('#sceneName', 'Cena 2');
    await okButton.click();
    await dashboardBtn.click();
    await page.waitForTimeout(500);
    const cardCharactersQty = await page.$eval('#cardsDashboard_scenes_qtd', (el) => el.innerHTML);
    expect(cardCharactersQty).toBe('2');
  });

  it('Deve haver a quantidade correta no cartão Capítulos', async () => {
    const dashboardBtn = await page.$('#dashboard');
    const BtnNew = await page.$('#estrutura');
    await BtnNew.click();
    await page.waitForSelector('#dialog-link-structure');
    const novoCartaoBtn = await page.$('#dialog-link-structure');
    await novoCartaoBtn.click();
    await page.waitForSelector('#structureName');
    await page.type('#structureName', 'Capítulo Um');
    await page.select('#structureType', 'chapters');
    const okButton = await page.$('#okBtn-structure:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);

    await dashboardBtn.click();
    await page.waitForTimeout(500);
    const cardCharactersQty = await page.$eval('#cardsDashboard_structure_qtd', (el) => el.innerHTML);
    expect(cardCharactersQty).toBe('1');
  });

  it('Deve haver a quantidade correta no cartão Timeline', async () => {
    const dashboardBtn = await page.$('#dashboard');
    const BtnNew = await page.$('#timeline');
    await BtnNew.click();
    await page.waitForSelector('#dialog-link-timeline');
    const novoCartaoBtn = await page.$('#dialog-link-timeline');
    await novoCartaoBtn.click();
    await page.waitForSelector('#timelineName');
    await page.type('#timelineName', 'Evento Um');
    await page.type('#timelineDate', '04-15-2023');
    const okButton = await page.$('#okBtn-timeline:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);
    const novoCartaoBtn2 = await page.$('#dialog-link-timeline');
    await novoCartaoBtn2.click();
    await page.waitForSelector('#timelineName');
    await page.type('#timelineName', 'Evento Dois');
    await page.type('#timelineDate', '04-16-2023');
    await okButton.click();

    await dashboardBtn.click();
    await page.waitForTimeout(500);
    const cardCharactersQty = await page.$eval('#cardsDashboard_timeline_qtd', (el) => el.innerHTML);
    expect(cardCharactersQty).toBe('2');
  });

  it('Deve haver a quantidade correta no cartão notas', async () => {
    const dashboardBtn = await page.$('#dashboard');
    const BtnNew = await page.$('#notas');
    await BtnNew.click();
    await page.waitForSelector('#dialog-link-note');
    const novoCartaoBtn = await page.$('#dialog-link-note');
    await novoCartaoBtn.click();
    await page.waitForSelector('#noteName');
    await page.type('#noteName', 'Pesquisar sobre o condado');
    const okButton = await page.$('#okBtn-notes:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);
    await page.waitForSelector('#dialog-link-elapsedTime');
    const novoCartaoBtn2 = await page.$('#dialog-link-elapsedTime');
    await novoCartaoBtn2.click();
    await page.waitForTimeout(500);

    await dashboardBtn.click();
    await page.waitForTimeout(500);
    const cardCharactersQty = await page.$eval('#cardsDashboard_notes_qtd', (el) => el.innerHTML);
    expect(cardCharactersQty).toBe('2');
  });

  it('Total de cartões deve conter o valor "13"', async () => {
    const totalCards = await page.$eval('#totalcards', (el) => el.innerHTML);
    expect(totalCards).toEqual('13');
  });

  it('Array últimos cartões devem ter a quantidade corretas', async () => {
    const recentElements = await page.$$eval('.lastEditTitle', (recentDiv) => recentDiv.length);
    expect(recentElements).toBe(10);
  });

  it('Array últimos cartões devem ter as posições corretas', async () => {
    const expectedList = [
      'Nova Lista',
      'Pesquisar sobre o condado',
      'Evento Dois',
      'Evento Um',
      'Capítulo Um',
      'Cena 2',
      'Cena 1',
      'A Batalha dos Campos de Pelennor',
      'Andúril',
      'O Condado',
    ];
    const result = await Promise.all(
      Array(10)
        .fill(null)
        .map(async (_, i) => {
          const lastCards = await page.$eval(`[data-testid='recent-card-${i}']`, (recentsDiv) => recentsDiv.innerText);
          return removerTextoEntreParenteses(lastCards);
        }),
    );
    expect(result).toEqual(expectedList);
  });
  it('Últimos cartões devem ter as posições corretas, mesmo depois de edita-los', async () => {
    const expectedList = [
      'A Batalha dos Campos de Pelennor - Editada',
      'Cena 2 - Editada',
      'Nova Lista',
      'Pesquisar sobre o condado',
      'Evento Dois',
      'Evento Um',
      'Capítulo Um',
      'Cena 1',
      'Andúril',
      'O Condado',
    ];
    const dashboardBtn = await page.$('#dashboard');
    const editCard1 = await page.$("[data-testid='recent-card-5']");
    await editCard1.click();
    await page.waitForTimeout(500);
    await page.waitForSelector('#title');
    await page.type('#title', ' - Editada');
    await dashboardBtn.click();
    await page.waitForTimeout(500);

    const editCard2 = await page.$("[data-testid='recent-card-7']");
    await editCard2.click();
    await page.waitForTimeout(500);
    await page.waitForSelector('#title');
    await page.type('#title', ' - Editada');
    const dashboardBtn2 = await page.$('#dashboard');
    await dashboardBtn2.click();
    await page.waitForTimeout(500);
    const result = await Promise.all(
      Array(10)
        .fill(null)
        .map(async (_, i) => {
          const lastCards = await page.$eval(`[data-testid='recent-card-${i}']`, (recentsDiv) => recentsDiv.innerText);
          return removerTextoEntreParenteses(lastCards);
        }),
    );
    expect(result).toEqual(expectedList);
  });
  it('As informações do projeto devem ser exbidas corretamente', async () => {
    const dashboardBtn = await page.$('#dashboard');
    const editProject = await page.$("[data-testid='edit-project']");
    await editProject.click();
    await page.waitForTimeout(500);
    await page.type('#title', ' - Editado');
    await page.type('#author', 'J. R. R. Tolkien');
    await page.type('#description', 'A história segue Frodo Baggins, um hobbit, e seus companheiros em uma perigosa jornada para destruir um poderoso anel que pode trazer a ruína ao mundo devido à sua corrupção maligna. A história é uma epopeia de fantasia com elementos de amizade, coragem, sacrifício e batalhas épicas contra as forças das trevas.');
    await page.select('#literary_genre', 'Romance');
    await page.select('#status', 'em andamento');
    await page.type('#startDate', '01-01-2000');
    await page.type('#finishDate', '01-01-2001');
    await page.click('#showSubtitle');
    await page.click('#deadline');
    await page.type('#subtitle', 'A Sociedade do Anel');
    await dashboardBtn.click();
    await page.waitForTimeout(500);
    const title = await page.$eval('.dashboardTitle', (el) => el.innerHTML);
    expect(title).toEqual('O Senhor dos Anéis - Editado');
    const subtitle = await page.$eval('#project-subtitle', (el) => el.innerText);
    expect(subtitle).toEqual('A Sociedade do Anel');
    const typeProject = await page.$eval('#project-type-dashboard', (el) => el.innerText);
    expect(typeProject).toEqual('Romance');
    const resume = await page.$eval('#project-resume', (el) => el.innerText);
    expect(resume).toEqual('A história segue Frodo Baggins, um hobbit, e seus companheiros em uma perigosa jornada para destruir um poderoso anel que pode trazer a ruína ao mundo devido à sua corrupção maligna. A história é uma epopeia de fantasia com elementos de amizade, coragem, sacrifício e batalhas épicas contra as forças das trevas.');
    const status = await page.$eval('#project-status-dashboard', (el) => el.innerText);
    expect(status).toEqual('em andamento');
    const daysRemaining = await page.$eval('#daysRemaining', (el) => el.innerText);
    expect(daysRemaining).toEqual('Prazo encerrado');
    const startDate = await page.$eval('#startDate', (el) => el.innerText);
    expect(startDate).toEqual('01/01/2000');
    const finishDate = await page.$eval('#finishDate', (el) => el.innerText);
    expect(finishDate).toEqual('01/01/2001');
  });
}, 20000);
