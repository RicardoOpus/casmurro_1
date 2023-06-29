/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

describe('Verifica Cenas', () => {
  let page;

  beforeAll(async () => {
    global.browser = await puppeteer.launch({
      headless: true,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await global.browser.close();
  });

  it('cenas devem ser mostradas na ordem em que foram criadas', async () => {
    const titles = ['Cena 1', 'Cena 2', 'Cena 3', 'Cena 4'];
    await page.goto('http://127.0.0.1:5500/index.html');
    await page.waitForTimeout(500);
    const newProjectButton = await page.$('#dialog-link');
    await newProjectButton.click();
    await page.waitForSelector('#projectName');
    await page.type('#projectName', 'O Senhor dos Anéis');
    const okButton = await page.$('#okBtn:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);

    await page.click('#cenas');
    await page.waitForSelector('#dialog-link-scene');
    await page.click('#dialog-link-scene');
    await page.waitForSelector('#sceneName');
    await page.type('#sceneName', 'Cena 1');
    await page.click('#okBtn-scene:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-scene');
    await page.waitForSelector('#sceneName');
    await page.type('#sceneName', 'Cena 2');
    await page.click('#okBtn-scene:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-scene');
    await page.waitForSelector('#sceneName');
    await page.type('#sceneName', 'Cena 3');
    await page.click('#okBtn-scene:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-scene');
    await page.waitForSelector('#sceneName');
    await page.type('#sceneName', 'Cena 4');
    await page.click('#okBtn-scene:not([disabled])');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Cenas devem ser mostradas na ordem correta após serem movidas', async () => {
    const titles = ['Cena 1', 'Cena 3', 'Cena 2', 'Cena 4'];
    const elementHandle = await page.$("[data-testid='scene-3']");
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

  it('Deve deletar uma cena', async () => {
    const titles = ['Cena 3', 'Cena 2', 'Cena 4'];
    await page.waitForTimeout(500);
    await page.click('.infosCardScenes');
    await page.waitForTimeout(500);
    await page.click('#deleteSceneCard');
    await page.waitForTimeout(500);
    await page.click('#btnDelScene');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Deve filtar por POV corretamente', async () => {
    const titles = ['Cena 3'];
    await page.click('#personagens');
    await page.waitForSelector('#dialog-link-character');
    await page.click('#dialog-link-character');
    await page.waitForSelector('#characterName');
    await page.type('#characterName', 'Frodo Bolseiro');
    await page.click('#okBtn-character:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('.contentListChar');
    await page.waitForTimeout(500);
    const colorInput = await page.$('#color');
    await colorInput.click();
    await page.waitForSelector('input[type="color"]');
    const tabCount = 4;
    const { keyboard } = page;
    for (let i = 0; i < tabCount; i += 1) {
      keyboard.press('Tab');
      // eslint-disable-next-line no-await-in-loop
      await page.waitForTimeout(500);
    }
    await page.type('input[type="color"]', '55');
    await page.click('#cenas');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-category');
    await page.select('#povName', '1');
    await page.click('#okBtn-cat');
    await page.waitForTimeout(500);
    await page.click('.infosCardScenes');
    await page.waitForTimeout(500);
    await page.select('#status', 'Em andamento');
    await page.select('#pov_id', '1');
    await page.click('#checkbox-date-scene');
    await page.waitForTimeout(500);
    await page.type('#date', '01-01-2023');
    await page.click('#cenas');
    await page.waitForTimeout(500);
    await page.click('.innerTabInactive');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  }, 20000);

  it('Deve deletar o filtro por POV', async () => {
    const numNavTrigger = await page.$$eval('.target', (navtriggers) => navtriggers.length);
    expect(numNavTrigger).toBe(2);
    await page.click('#dialog-link-delcategory');
    await page.waitForTimeout(500);
    await page.select('#povDelName', '1');
    await page.click('#okBtn-delpov');
    await page.waitForTimeout(500);
    const numNavTrigger2 = await page.$$eval('.target', (navtriggers) => navtriggers.length);
    expect(numNavTrigger2).toBe(1);
  });

  it('A cena editada deve conter as informações corretas', async () => {
    const result = 'Frodo Bolseiro Em andamento • 01/01/2023';
    const sceneInfos = await page.$eval('.infosCardScenes', (el) => el.innerText);
    expect(sceneInfos).toBe(result);
  });

  it('Deve filtrar corretamento as cenas por capítulo', async () => {
    const titles = ['1 - Cena 3', '2 - Cena 2'];
    await page.click('#estrutura');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-structure');
    await page.waitForSelector('#structureName');
    await page.type('#structureName', 'Capítulo Um');
    await page.select('#structureType', 'chapters');
    const okButton = await page.$('#okBtn-structure:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);

    await page.click('#chaptersTab');
    await page.waitForTimeout(500);
    await page.click("[data-testid='chapter-link-1']");
    await page.waitForTimeout(500);
    await page.click('#btn-addSceneToChap');
    await page.click('#cena-3');
    await page.click('#cena-2');
    await page.click('#btnChapScene');
    await page.waitForTimeout(500);
    await page.click('#cenas');
    await page.waitForTimeout(500);
    await page.click('p[onclick="chapterFilterLoadPage(1)"]');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.portlet-header');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });
});
