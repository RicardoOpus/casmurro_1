/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

describe('Verifica página incial de projetos', () => {
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

  it("O botão 'Projetos' deve retornar para welcome", async () => {
    const projectButton = await page.$("[data-testid='projects-link']");
    await page.waitForTimeout(1000);
    expect(projectButton).toBeTruthy();
    await projectButton.click();
  });

  it('A clicar no projeto, deve carregar a Dashboard', async () => {
    await page.waitForSelector('.projectTitle');
    const projectTitleLink = await page.$eval('.projectTitle', (el) => el.innerHTML);
    expect(projectTitleLink).toEqual('O Senhor dos Anéis');
    const projectLink = await page.$('.projectsName');
    await projectLink.click();
    await page.waitForSelector('#project-title-dashboard');
    await page.waitForTimeout(1000);
    const projectTitle = await page.$eval('#project-title-dashboard', (el) => el.innerText);
    expect(projectTitle).toEqual('O Senhor dos Anéis');
  });
});
