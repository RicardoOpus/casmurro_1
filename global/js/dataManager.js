const db = new Dexie('casmurro-test');
db.version(1).stores({
  projects: "++id,title,settings,data,thrash,infos",
  settings: "++id,currentproject"
});

async function hasSettings() {
  const projectActual = await db.settings.toArray();
  if (!projectActual[0]) {
    db.settings.add({ currentproject: 0 })
  }
};

hasSettings();