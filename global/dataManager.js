const db = new Dexie('casmurro-test');
db.version(1).stores({
  characters: "++id,name,age,birth,type,resume"
});

// tipo de classe:
// class Character {
//   constructor(name, age) {
//     this.name = name
//     this.age = age
//   }

//   static getAll() {
//     return db.personagens.toArray();
//   }

//   save() {
//     db.personagens.add(this);
//   }

//   static update() {
//     db.personagens.update(this)
//   }

//   static delete(pk) {
//     db.personagens.delete(pk)
//   }
// };

// Cadastro simples:
// const Laira = new Character("Laira", 25)
// Laira.save()
// const Roberto = new Character("Roberto", 25)
// Roberto.save()

// Buscar todos
// Character.getAll().then(personagens => console.log(personagens));

// Deletar
// Character.delete(1);

// Atualiza
// const Laira = new Character()

// db.personagens.update(4, {name: "Laira da boa!"})


// db.characters.add("Roberto", "16/05/1988", "Principal", "Roberto é um cara legal que vai se meter em encrenca.");

// db.characters.bulkAdd([
//   {name: "Roberto", age: 35, birth: "16/05/1988", type: "Principal", resume: "Roberto é um cara legal que vai se meter em encrenca."},
//   {name: "Maria", age: 55, birth: "16/05/1955", type: "Secundário", resume: "Uma mulher que não leva desaforo para casa."},
//   {name: "João", age: 15, birth: "16/05/1999", type: "Principal", resume: "Um cara lega."},
//   {name: "Eduardo", age: 99, birth: "16/05/1925", type: "Menor", resume: "O velho que insiste em não morrer."},
//   {name: "Jonas", age: 27, birth: "16/05/1958", type: "Secundário", resume: "Ninguém saba nada sobre ele."}
// ]);