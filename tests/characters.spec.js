/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

describe('Verifica Personagens', () => {
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

  it('Personagens devem ser mostrados em ordem alfabética', async () => {
    const titles = ['🯊 Aragorn', '🯊 Frodo Bolseiro', '🯊 Gollum'];
    await page.goto('http://127.0.0.1:5500/index.html');
    await page.waitForTimeout(500);
    const newProjectButton = await page.$('#dialog-link');
    await newProjectButton.click();
    await page.waitForSelector('#projectName');
    await page.type('#projectName', 'O Senhor dos Anéis');
    const okButton = await page.$('#okBtn:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);

    const personagensBtn = await page.$('#personagens');
    await personagensBtn.click();
    await page.waitForSelector('#dialog-link-character');
    const novoCartaoBtn = await page.$('#dialog-link-character');
    await novoCartaoBtn.click();
    await page.waitForSelector('#characterName');
    await page.type('#characterName', 'Gollum');
    const okButton1 = await page.$('#okBtn-character:not([disabled])');
    await okButton1.click();
    await page.waitForTimeout(500);
    const novoCartaoBtn2 = await page.$('#dialog-link-character');
    await novoCartaoBtn2.click();
    await page.waitForSelector('#characterName');
    await page.type('#characterName', 'Frodo Bolseiro');
    await okButton1.click();
    await page.waitForTimeout(500);
    const novoCartaoBtn3 = await page.$('#dialog-link-character');
    await novoCartaoBtn3.click();
    await page.waitForSelector('#characterName');
    await page.type('#characterName', 'Aragorn');
    await okButton1.click();
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('.wordlTitle');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Filtros devem mostrar personagens corretamente', async () => {
    const char1 = await page.$("[data-testid='card-3']");
    await char1.click();
    await page.waitForTimeout(500);
    await page.select('#category', 'Principais');
    await page.click('#personagens');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-category-char');
    await page.type('#categoryCharName', 'Teste');
    await page.click('#okBtn-cat');
    await page.waitForTimeout(500);
    const char2 = await page.$("[data-testid='card-2']");
    await char2.click();
    await page.waitForTimeout(500);
    await page.select('#category', 'Teste');
    await page.click('#personagens');
    await page.waitForTimeout(500);
    await page.click('#Principais');
    const wordlTitleElements = await page.$$('.wordlTitle');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(['🯊 Aragorn']);
    await page.click('#Secundários');
    const wordlTitleElements2 = await page.$$('.wordlTitle');
    const wordlTitleTexts2 = await Promise.all(wordlTitleElements2
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts2).toEqual([]);
    await page.click('#Teste');
    const wordlTitleElements3 = await page.$$('.wordlTitle');
    const wordlTitleTexts3 = await Promise.all(wordlTitleElements3
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts3).toEqual(['🯊 Frodo Bolseiro']);
  });

  it('Deve deletar um personagem', async () => {
    const titles = ['🯊 Aragorn', '🯊 Gollum'];
    await page.click('.wordlTitle');
    await page.waitForTimeout(500);
    await page.click('#deleteCharCard');
    await page.waitForTimeout(500);
    await page.click('#btnDelChar');
    await page.waitForTimeout(500);
    await page.click('#Todos');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.wordlTitle');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Deve deletar uma categoria', async () => {
    const titles = ['Todos (2)', 'Principais (1)', 'Teste (0)'];
    await page.click('#dialog-link-delcategory-char');
    await page.waitForTimeout(500);
    await page.select('#categoryDelName-char', 'Secundários');
    await page.click('#okBtn-delcat');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.target');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });
});
