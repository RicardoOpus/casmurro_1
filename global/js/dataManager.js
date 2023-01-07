const db = new Dexie('casmurro-test');
db.version(1).stores({
  characters: "++id,edit,name,age,birth,type,resume"
});
