/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const db = new Dexie('casmurro-test');
db.version(1).stores({
  projects: '++id,title,status,cards_qty,settings,last_edit,timestamp,data,trash',
  settings: '++id,currentproject',
});

window.myDb = db;

async function hasSettings() {
  const projectActual = await db.settings.toArray();
  if (!projectActual[0]) {
    return db.settings.add({ currentproject: 0, currentCard: '', currendIdCard: 0 });
  }
}
