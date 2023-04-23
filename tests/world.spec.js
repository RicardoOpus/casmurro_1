/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

describe('Verifica Mundo', () => {
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

  it('Itens mundo devem ser mostrados em ordem alfabética', async () => {
    const titles = ['A Batalha dos Campos de Pelennor', 'Andúril', 'O Condado'];
    await page.goto('http://127.0.0.1:5500/index.html');
    await page.waitForTimeout(500);
    const newProjectButton = await page.$('#dialog-link');
    await newProjectButton.click();
    await page.waitForSelector('#projectName');
    await page.type('#projectName', 'O Senhor dos Anéis');
    const okButton = await page.$('#okBtn:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);

    const BtnNew = await page.$('#mundo');
    await BtnNew.click();
    await page.waitForSelector('#dialog-link-world');
    const novoCartaoBtn = await page.$('#dialog-link-world');
    await novoCartaoBtn.click();
    await page.waitForSelector('#worldName');
    await page.type('#worldName', 'O Condado');
    const okButtonNew = await page.$('#okBtn-world:not([disabled])');
    await okButtonNew.click();
    await page.waitForTimeout(500);
    const BtnNew2 = await page.$('#dialog-link-world');
    await BtnNew2.click();
    await page.waitForSelector('#worldName');
    await page.type('#worldName', 'Andúril');
    await okButtonNew.click();
    await page.waitForTimeout(500);
    const BtnNew3 = await page.$('#dialog-link-world');
    await BtnNew3.click();
    await page.waitForSelector('#worldName');
    await page.type('#worldName', 'A Batalha dos Campos de Pelennor');
    await okButtonNew.click();
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('.wordlTitle');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Filtros devem mostrar itens mundo corretamente', async () => {
    const char1 = await page.$("[data-testid='card-2']");
    await char1.click();
    await page.waitForTimeout(500);
    await page.select('#category', 'Objeto');
    await page.click('#mundo');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-category');
    await page.type('#categoryName', 'Cultura');
    await page.click('#okBtn-cat');
    await page.waitForTimeout(500);
    const char2 = await page.$("[data-testid='card-1']");
    await char2.click();
    await page.waitForTimeout(500);
    await page.select('#category', 'Cultura');
    await page.click('#mundo');
    await page.waitForTimeout(500);
    await page.click('#Objeto');
    const wordlTitleElements = await page.$$('.wordlTitle');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(['Andúril']);
    await page.click('#Local');
    const wordlTitleElements2 = await page.$$('.wordlTitle');
    const wordlTitleTexts2 = await Promise.all(wordlTitleElements2
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts2).toEqual([]);
    await page.click('#Cultura');
    const wordlTitleElements3 = await page.$$('.wordlTitle');
    const wordlTitleTexts3 = await Promise.all(wordlTitleElements3
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts3).toEqual(['O Condado']);
  });

  it('Deve deletar um item mundo', async () => {
    const titles = ['A Batalha dos Campos de Pelennor', 'Andúril'];
    await page.click('.wordlTitle');
    await page.waitForTimeout(500);
    await page.click('#deleteWorldCard');
    await page.waitForTimeout(500);
    await page.click('#btnDelWorld');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.wordlTitle');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Deve deletar uma categoria', async () => {
    const titles = ['Objeto', 'Fato histórico', 'Cultura'];
    await page.click('#dialog-link-delcategory');
    await page.waitForTimeout(500);
    await page.select('#categoryDelName', 'Local');
    await page.click('#okBtn-delcat');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.target');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });
});
