const db = new Dexie('casmurro-test');
db.version(1).stores({
  projects: "++id,title,status,cards_qty,settings,last_edit,timestamp,data,thrash,infos",
  settings: "++id,currentproject"
});

async function hasSettings() {
  console.log("chamour hasSettings, deveria vir primeiro");
  const projectActual = await db.settings.toArray();
  if (!projectActual[0]) {
    const updated = await db.settings.add({ currentproject: 0 })
    return updated
  }
};
