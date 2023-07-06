/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

function removerTextoEntreParenteses(texto) {
  const regex = /\s*\([^)]*\)/g;
  const resultado = texto.replace(regex, '');
  return resultado.trim();
}

describe('Verifica Notas', () => {
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

  it('Notas devem ser mostradas em ordem alfabética', async () => {
    const titles = ['Avisar editor', 'Nova Lista', 'Pesquisar sobre o condado', 'Uma ideia'];
    await page.goto('http://127.0.0.1:5500/index.html');
    await page.waitForTimeout(500);
    const newProjectButton = await page.$('#dialog-link');
    await newProjectButton.click();
    await page.waitForSelector('#projectName');
    await page.type('#projectName', 'O Senhor dos Anéis');
    const okButton = await page.$('#okBtn:not([disabled])');
    await okButton.click();
    await page.waitForTimeout(500);

    await page.click('#notas');
    await page.waitForTimeout(500);
    await page.waitForSelector('#dialog-link-note');
    await page.click('#dialog-link-note');
    await page.waitForTimeout(500);
    await page.type('#noteName', 'Uma ideia');
    await page.click('#okBtn-notes:not([disabled])');
    await page.waitForTimeout(500);

    await page.waitForSelector('#dialog-link-note');
    await page.click('#dialog-link-note');
    await page.waitForTimeout(500);
    await page.type('#noteName', 'Pesquisar sobre o condado');
    await page.click('#okBtn-notes:not([disabled])');
    await page.waitForTimeout(500);

    await page.waitForSelector('#dialog-link-note');
    await page.click('#dialog-link-note');
    await page.waitForTimeout(500);
    await page.type('#noteName', 'Avisar editor');
    await page.click('#okBtn-notes:not([disabled])');
    await page.waitForTimeout(500);

    await page.waitForSelector('#dialog-link-elapsedTime');
    await page.click('#dialog-link-elapsedTime');
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('.wordlTitle');
    const result = await Promise.all(
      wordlTitleElements
        .map(async (element) => {
          const lastCards = await element.evaluate((node) => node.textContent);
          return removerTextoEntreParenteses(lastCards);
        }),
    );
    expect(result).toEqual(titles);
  }, 10000);

  it('Mudar título da nota deve permanecer mostrando em ordem alfabética', async () => {
    const titles = ['Nova Lista', 'Pesquisar sobre o condado', 'Refazer cena 3', 'Uma ideia'];
    await page.click("[data-testid='note-item-3']");
    await page.waitForTimeout(500);
    const inputElement = await page.$('#title');
    await inputElement.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await inputElement.type('Refazer cena 3');
    await page.waitForTimeout(500);
    await page.click('#notas');
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('.wordlTitle');
    const result = await Promise.all(
      wordlTitleElements
        .map(async (element) => {
          const lastCards = await element.evaluate((node) => node.textContent);
          return removerTextoEntreParenteses(lastCards);
        }),
    );
    expect(result).toEqual(titles);
  });

  it('Deve ser possível cirar uma nova categoria', async () => {
    await page.click('#dialog-link-category-note');
    await page.waitForTimeout(500);
    await page.click('#dialog-link-category-note');
    await page.waitForTimeout(500);
    await page.type('#categoryNoteName', 'Playlist');
    await page.click('#okBtn-cat-note');
    await page.waitForTimeout(500);
    const tabButton = await page.$('#Playlist');
    expect(tabButton).toBeTruthy();
  });

  it('Categoria deve filtrar corretamente as notas', async () => {
    const titles = ['Refazer cena 3'];
    await page.click("[data-testid='note-item-3']");
    await page.waitForTimeout(500);
    await page.select('#category', 'Playlist');
    await page.click('#notas');
    await page.waitForTimeout(500);
    await page.click('#Playlist');
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('.wordlTitle');
    const result = await Promise.all(
      wordlTitleElements
        .map(async (element) => {
          const lastCards = await element.evaluate((node) => node.textContent);
          return removerTextoEntreParenteses(lastCards);
        }),
    );
    expect(result).toEqual(titles);
  });

  it('Deve ser possível excluir uma categoria', async () => {
    const tabButton = await page.$('#Pesquisas');
    expect(tabButton).toBeTruthy();
    await page.click('#dialog-link-delcategory-note');
    await page.waitForTimeout(500);
    await page.select('#categoryDelNoteName', 'Pesquisas');
    await page.click('#okBtn-delcat-note');
    await page.waitForTimeout(500);
    const tabButton2 = await page.$('#Pesquisas');
    expect(tabButton2).toBeFalsy();
  });

  it('Deve ser possível excluir um nota', async () => {
    const titles = ['Nova Lista', 'Pesquisar sobre o condado', 'Uma ideia'];
    await page.click("[data-testid='note-item-3']");
    await page.waitForTimeout(500);
    await page.click('#deleteNoteCard');
    await page.waitForTimeout(500);
    await page.click('#btnOkdelNote');
    await page.waitForTimeout(500);
    await page.click('#Todos');
    await page.waitForTimeout(500);
    const wordlTitleElements = await page.$$('.wordlTitle');
    const result = await Promise.all(
      wordlTitleElements
        .map(async (element) => {
          const lastCards = await element.evaluate((node) => node.textContent);
          return removerTextoEntreParenteses(lastCards);
        }),
    );
    expect(result).toEqual(titles);
  });

  it('Deve ser possível excluir uma lista de tarefas', async () => {
    const titles = ['Pesquisar sobre o condado', 'Uma ideia'];
    await page.click("[data-testid='note-item-4']");
    await page.waitForTimeout(500);
    await page.click('#deleteNoteListCard');
    await page.waitForTimeout(500);
    await page.click('#btnOkdelNotelist');
    await page.waitForTimeout(500);

    const wordlTitleElements = await page.$$('.wordlTitle');
    const result = await Promise.all(
      wordlTitleElements
        .map(async (element) => {
          const lastCards = await element.evaluate((node) => node.textContent);
          return removerTextoEntreParenteses(lastCards);
        }),
    );
    expect(result).toEqual(titles);
  });
});
