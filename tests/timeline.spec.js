/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

describe('Verifica página timeline', () => {
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

  it('Deve criar um novo projeto', async () => {
    await page.goto('http://127.0.0.1:5500/index.html');
    await page.waitForTimeout(1000);
    const newProjectButton = await page.$('#dialog-link');
    expect(newProjectButton).toBeTruthy();
    await newProjectButton.click();
    await page.waitForSelector('#projectName');
    await page.type('#projectName', 'O Senhor dos Anéis');
    const okButton = await page.$('#okBtn:not([disabled])');
    expect(okButton).toBeTruthy();
    await okButton.click();
  });

  it('Cartões devem ser mostrados ordenados por data', async () => {
    const titles = ['12/04/2023', '15/04/2023', '16/04/2023'];
    await page.waitForTimeout(500);
    await page.click('#timeline');
    await page.waitForSelector('#dialog-link-timeline');
    await page.click('#dialog-link-timeline');
    await page.waitForTimeout(500);
    await page.type('#timelineName', 'Evento Um');
    await page.type('#timelineDate', '04-15-2023');
    await page.click('#okBtn-timeline:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-timeline');
    await page.waitForSelector('#timelineName');
    await page.type('#timelineName', 'Evento Dois');
    await page.type('#timelineDate', '04-16-2023');
    await page.click('#okBtn-timeline:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-timeline');
    await page.waitForSelector('#timelineName');
    await page.type('#timelineName', 'Evento Três');
    await page.type('#timelineDate', '04-12-2023');
    await page.click('#okBtn-timeline:not([disabled])');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.timeDate');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Mudar a data de um cartão deve alterar sua posição na lista', async () => {
    const titles = ['10/04/2023', '12/04/2023', '16/04/2023'];
    await page.click("[data-testid='timeline-item-1']");
    await page.waitForTimeout(500);
    await page.type('#date', '04-10-2023');
    await page.type('#content', 'Frodo e seus amigos chegam a uma cidade chamada Bri, onde encontram o humano Aragorn, que se junta a eles na jornada para Valfenda. Eles são seguidos pelos Nazgûl, que atacam e ferem Frodo. Eles escapam para o refúgio de Rivendell');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.timeDate');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
    const cardtext = await page.$eval("[data-testid='timeline-content-1']", (el) => el.innerText);
    expect(cardtext).toBe('Frodo e seus amigos chegam a uma cidade chamada Bri, onde encontram o humano Aragorn, que se junta a eles na jornada para Valfenda. Eles são seguidos pelos Nazgûl, que atacam e ferem Frodo. Eles escapam para o refúgio de Rivendell');
  });

  it('Cartões com mesma data devem estar agrupados', async () => {
    const elementBefore = await page.$('#timeline-element-3');
    const aTagsCountBefore = await elementBefore.$$eval('a', (elements) => elements.length);
    expect(aTagsCountBefore).toEqual(2);
    await page.waitForSelector('#dialog-link-timeline');
    await page.click('#dialog-link-timeline');
    await page.waitForTimeout(500);
    await page.type('#timelineName', 'Evento Quatro');
    await page.type('#timelineDate', '04-12-2023');
    await page.click('#okBtn-timeline:not([disabled])');
    await page.waitForTimeout(500);
    const elementAfter = await page.$('#timeline-element-3');
    const aTagsCountAfter = await elementAfter.$$eval('a', (elements) => elements.length);
    expect(aTagsCountAfter).toEqual(4);
  });

  it('Personagnes com data de nascimento devem criar uma entrada correspondente em timeline', async () => {
    await page.click('#personagens');
    await page.waitForSelector('#dialog-link-character');
    await page.click('#dialog-link-character');
    await page.waitForSelector('#characterName');
    await page.type('#characterName', 'Frodo Bolseiro');
    await page.click('#okBtn-character:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('.contentListChar');
    await page.waitForTimeout(500);
    await page.click('#checkbox-date-birth');
    await page.click('#checkbox-date-death');
    await page.waitForTimeout(500);
    await page.type('#date_birth', '01-01-2023');
    await page.type('#date_death', '05-05-2027');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const charBirth = await page.$eval("[data-testid='timeline-item-5']", (el) => el.innerText);
    expect(charBirth).toEqual('01/01/2023\n✶ Nasce Frodo Bolseiro');
  });

  it('Personagnes com data de morte devem criar uma entrada correspondente em timeline', async () => {
    const charDeath = await page.$eval("[data-testid='timeline-item-6']", (el) => el.innerText);
    expect(charDeath).toEqual('05/05/2027\n🪦 Morre Frodo Bolseiro');
  });

  it('Mudar a data de aniverário de um persongem deve mudar corratamente a entrada correspondente em timeline', async () => {
    await page.click('#personagens');
    await page.waitForTimeout(500);
    await page.click('.contentListChar');
    await page.waitForTimeout(500);
    await page.type('#date_birth', '02-02-2023');
    await page.type('#date_death', '06-06-2027');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const charBirth = await page.$eval("[data-testid='timeline-item-5']", (el) => el.innerText);
    expect(charBirth).toEqual('02/02/2023\n✶ Nasce Frodo Bolseiro');
  });

  it('Mudar a data de morte de um persongem deve mudar corratamente a entrada correspondente em timeline', async () => {
    const charDeath = await page.$eval("[data-testid='timeline-item-6']", (el) => el.innerText);
    expect(charDeath).toEqual('06/06/2027\n🪦 Morre Frodo Bolseiro');
  });

  it('Cartões do tipo fato histórico devem criar uma entrada correspondente em timeline', async () => {
    await page.click('#mundo');
    await page.waitForTimeout(500);
    await page.waitForSelector('#dialog-link-world');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-world');
    await page.waitForSelector('#worldName');
    await page.type('#worldName', 'O Condado');
    await page.click('#okBtn-world:not([disabled])');
    await page.waitForTimeout(500);
    await page.click("[data-testid='card-1']");
    await page.waitForTimeout(500);
    await page.select('#category', 'Fato histórico');
    await page.waitForTimeout(500);
    await page.type('#date', '07-07-2023');
    await page.waitForTimeout(500);
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const charBirth = await page.$eval("[data-testid='timeline-item-7']", (el) => el.innerText);
    expect(charBirth).toEqual('07/07/2023\n🗓 O Condado');
  });

  it('Mudar a data de um fato histórico deve mudar corratamente a entrada correspondente em timeline', async () => {
    await page.click('#mundo');
    await page.waitForTimeout(500);
    await page.click("[data-testid='card-1']");
    await page.waitForTimeout(500);
    await page.type('#date', '08-08-2023');
    await page.waitForTimeout(500);
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const charBirth = await page.$eval("[data-testid='timeline-item-7']", (el) => el.innerText);
    expect(charBirth).toEqual('08/08/2023\n🗓 O Condado');
  });

  it('Cenas com data devem criar uma entrada correspondente em timeline', async () => {
    await page.click('#cenas');
    await page.waitForTimeout(500);
    await page.waitForSelector('#dialog-link-scene');
    await page.click('#dialog-link-scene');
    await page.waitForTimeout(500);
    await page.waitForSelector('#sceneName');
    await page.type('#sceneName', 'Cena 1');
    await page.click('#okBtn-scene:not([disabled])');
    await page.waitForTimeout(500);
    await page.click('.infosCardScenes');
    await page.waitForTimeout(500);
    await page.click('#checkbox-date-scene');
    await page.waitForTimeout(500);
    await page.type('#date', '09-09-2023');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const charBirth = await page.$eval("[data-testid='timeline-item-8']", (el) => el.innerText);
    expect(charBirth).toEqual('09/09/2023\n🎬 Cena 1');
  });

  it('Mudar a data de uma cena deve mudar corratamente a entrada correspondente em timeline', async () => {
    await page.click('#cenas');
    await page.waitForTimeout(500);
    await page.click('.infosCardScenes');
    await page.waitForTimeout(500);
    await page.type('#date', '10-10-2023');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const charBirth = await page.$eval("[data-testid='timeline-item-8']", (el) => el.innerText);
    expect(charBirth).toEqual('10/10/2023\n🎬 Cena 1');
  });

  it('Deve ser possível criar um filtro por Personagem', async () => {
    await page.click('#dialog-link-character-filter');
    await page.waitForTimeout(500);
    await page.select('#catCharacterName', '1');
    await page.click('#okBtn-cat-time');
    await page.waitForTimeout(500);
    await page.click("[data-testid='timeline-content-1']");
    await page.waitForTimeout(500);
    await page.select('#pov_id', '1');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const tabButton = await page.$('#tab1');
    expect(tabButton).toBeTruthy();
  });

  it('O filtro de personagem deve mostrar as informações corretas', async () => {
    const titles = ['02/02/2023', '10/04/2023', '06/06/2027'];
    await page.click('#tab1');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.timeDate');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Deve ser possível deletar um filtro', async () => {
    await page.click('#dialog-link-delcategory');
    await page.waitForTimeout(500);
    await page.select('#categoryDeltimelineName', '1');
    await page.click('#okBtn-delcatTimeline');
    await page.waitForTimeout(500);
    const tabButton = await page.$('#tab1');
    expect(tabButton).toBeFalsy();
  });

  it('Deve ser possível deletar um cartão', async () => {
    const titles = ['02/02/2023', '12/04/2023', '16/04/2023', '08/08/2023', '10/10/2023', '06/06/2027'];
    await page.waitForTimeout(500);
    await page.click("[data-testid='timeline-content-1']");
    await page.waitForTimeout(500);
    await page.click('#deleteTimelineCard');
    await page.waitForTimeout(500);
    await page.click('#btnDelTimeline');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.timeDate');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Apagar uma datas de nascimento e morte de um personagem deve deletar a entrada correspondente em timeline', async () => {
    const titles = ['12/04/2023', '16/04/2023', '08/08/2023', '10/10/2023'];
    await page.click('#personagens');
    await page.waitForTimeout(500);
    await page.click('.contentListChar');
    await page.waitForTimeout(500);
    await page.click('#checkbox-date-birth');
    await page.click('#checkbox-date-death');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.timeDate');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Apagar uma data de acontecimento histórico deve deletar a entrada correspondente em timeline', async () => {
    const titles = ['12/04/2023', '16/04/2023', '10/10/2023'];
    await page.click('#mundo');
    await page.waitForTimeout(500);
    await page.click("[data-testid='card-1']");
    await page.waitForTimeout(500);
    await page.select('#category', 'Objeto');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.timeDate');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });

  it('Apagar a data de uma cena deve deletar a entrada correspondente em timeline', async () => {
    const titles = ['12/04/2023', '16/04/2023'];
    await page.click('#cenas');
    await page.waitForTimeout(500);
    await page.click('.infosCardScenes');
    await page.waitForTimeout(500);
    await page.click('#checkbox-date-scene');
    await page.click('#timeline');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.timeDate');
    const wordlTitleTexts = await Promise.all(wordlTitleElements
      .map(async (element) => element.evaluate((node) => node.textContent)));
    expect(wordlTitleTexts).toEqual(titles);
  });
});
