/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

function removeEspacosQuebrasDeLinhas(arr) {
  return arr.map((item) => item.replace(/\s+/g, ' ').trim());
}

describe('Verifica Estrutura', () => {
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

  it('Capítulos devem ser mostrados na ordem em que foram criados', async () => {
    const titles = ['Capítulo 1 - Uma festa muito esperada', 'Capítulo 2 - A Sombra do Passado', 'Capítulo 3 - Três não é demais'];
    await page.goto('http://127.0.0.1:5500/index.html');
    await page.waitForTimeout(500);
    const newProjectButton = await page.$('#dialog-link');
    await newProjectButton.click();
    await page.waitForSelector('#projectName');
    await page.type('#projectName', 'O Senhor dos Anéis');
    const okButton = await page.$('#okBtn:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);

    const newBtn = await page.$('#estrutura');
    await newBtn.click();
    await page.waitForSelector('#dialog-link-structure');
    const novoCartaoBtn = await page.$('#dialog-link-structure');
    await novoCartaoBtn.click();
    await page.waitForSelector('#structureName');
    await page.type('#structureName', 'Uma festa muito esperada');
    await page.select('#structureType', 'chapters');
    const okButton1 = await page.$('#okBtn-structure:not([disabled])');
    await okButton1.click();
    await page.waitForTimeout(500);
    const novoCartaoBtn2 = await page.$('#dialog-link-structure');
    await novoCartaoBtn2.click();
    await page.waitForSelector('#structureName');
    await page.type('#structureName', 'A Sombra do Passado');
    await page.select('#structureType', 'chapters');
    await okButton1.click();
    await page.waitForTimeout(500);
    const novoCartaoBtn3 = await page.$('#dialog-link-structure');
    await novoCartaoBtn3.click();
    await page.waitForSelector('#structureName');
    await page.type('#structureName', 'Três não é demais');
    await page.select('#structureType', 'chapters');
    await okButton1.click();
    await page.waitForTimeout(500);
    await page.click('#chaptersTab');
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  }, 20000);

  it('Capítulos devem ser mostrados na ordem correta após serem movidos', async () => {
    const titles = ['Capítulo 1 - Uma festa muito esperada', 'Capítulo 2 - Três não é demais', 'Capítulo 3 - A Sombra do Passado'];
    const elementHandle = await page.$("[data-testid='chapter-3']");
    const boundingBox = await elementHandle.boundingBox();
    await page.mouse
      .move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await page.mouse.down();
    await page.mouse
      .move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2 - 100);
    await page.mouse.up();
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Deve deletar um capítulo', async () => {
    const titles = ['Capítulo 1 - Três não é demais', 'Capítulo 2 - A Sombra do Passado'];
    await page.waitForTimeout(500);
    await page.click('.sceneCartContent');
    await page.waitForTimeout(500);
    await page.click('#deleteChapterCard');
    await page.waitForTimeout(500);
    await page.click('#btnDelChap');
    await page.waitForTimeout(500);
    await page.click('#chaptersTab');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Partes devem ser mostrados na ordem em que foram criadas', async () => {
    const titles = ['Parte 1 - Parte 1', 'Parte 2 - Parte 2'];
    await page.click('#partsTab');
    await page.waitForTimeout(500);
    const novoCartaoBtn = await page.$('#dialog-link-structure');
    await novoCartaoBtn.click();
    await page.waitForSelector('#structureName');
    await page.type('#structureName', 'Parte 1');
    await page.select('#structureType', 'parts');
    const okButton1 = await page.$('#okBtn-structure:not([disabled])');
    await okButton1.click();
    await page.waitForTimeout(500);
    const novoCartaoBtn2 = await page.$('#dialog-link-structure');
    await novoCartaoBtn2.click();
    await page.waitForSelector('#structureName');
    await page.type('#structureName', 'Parte 2');
    await page.select('#structureType', 'parts');
    await okButton1.click();
    await page.waitForTimeout(500);
    await page.click('#partsTab');
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  }, 20000);

  it('Partes devem ser mostradas na ordem correta após serem movidas', async () => {
    const titles = ['Parte 1 - Parte 2', 'Parte 2 - Parte 1'];
    const elementHandle = await page.$("[data-testid='part-5']");
    const boundingBox = await elementHandle.boundingBox();
    await page.mouse
      .move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await page.mouse.down();
    await page.mouse
      .move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2 - 100);
    await page.mouse.up();
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Deve deletar uma parte', async () => {
    const titles = ['Parte 1 - Parte 1'];
    await page.waitForTimeout(500);
    await page.click('.sceneCartContent');
    await page.waitForTimeout(500);
    await page.click('#deletePartCard');
    await page.waitForTimeout(500);
    await page.click('#btnDelPart');
    await page.waitForTimeout(500);
    await page.click('#partsTab');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Esboço deve mostrar estrutura correta, Partes - Capítulos - Cenas', async () => {
    const result = ['Parte 1 Três não é demais Cena 1 Cena 2 A Sombra do Passado Cena 3 Cena 4'];
    await page.waitForTimeout(500);
    await page.click('.sceneCartContent');
    await page.waitForTimeout(500);
    await page.click('#btn-addChaptersToPart');
    await page.click('#chapter-3');
    await page.click('#chapter-2');
    await page.click('#btnOkChap');
    await page.waitForTimeout(500);

    await page.click('#cenas');
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
    await page.waitForTimeout(500);
    await page.click('#dialog-link-scene');
    await page.type('#sceneName', 'Cena 3');
    await page.click('#okBtn-scene:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-scene');
    await page.type('#sceneName', 'Cena 4');
    await okButton.click();

    await page.click('#estrutura');
    await page.waitForTimeout(500);
    await page.click('#chaptersTab');
    await page.waitForTimeout(500);
    await page.click("[data-testid='chapter-link-3']");
    await page.waitForTimeout(500);
    await page.click('#btn-addSceneToChap');
    await page.click('#cena-1');
    await page.click('#cena-2');
    await page.click('#btnChapScene');
    await page.waitForTimeout(500);
    await page.click('#estrutura');
    await page.waitForTimeout(500);
    await page.click('#chaptersTab');
    await page.waitForTimeout(500);

    await page.click("[data-testid='chapter-link-2']");
    await page.waitForTimeout(500);
    await page.click('#btn-addSceneToChap');
    await page.click('#cena-3');
    await page.click('#cena-4');
    await page.click('#btnChapScene');
    await page.waitForTimeout(500);
    await page.click('#estrutura');
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('#outlineContent');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => (await element.evaluate((node) => node.textContent)).trim()));
    const expected = removeEspacosQuebrasDeLinhas(wordlTitleTexts);
    expect(expected).toStrictEqual(result);
  }, 10000);
});
