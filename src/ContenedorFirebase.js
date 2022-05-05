const admin = require("firebase-admin");
const Firebase = require("firebase-admin");

const serviceAccount = require("./proyecto-backend-48732-firebase-adminsdk-2qneu-136b2d954d.json");
Firebase.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://proyecto-backend-48732.firebaseio.com",
});
console.log("Conectado a Firebase");

const db = admin.firestore();

class ContenedorFirebase {
  constructor(collection) {
    this.collection = db.collection(collection);
  }

  async getAll() {
    const listResult = [];
    const list = await this.collection.get();
    list.forEach((doc) => {
      listResult.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return listResult;
  }

  async getById(id) {
    const obj = await this.collection.doc(id).get();
    const data = obj.data();
    return data;
  }

  async save(x) {
    return await this.collection.add(x);
  }

  async update(id, info) {
    const objUpdate = await this.collection.doc(id).update(info);
    return objUpdate;
  }

  async deleteAll() {
    return await this.collection.doc.delete();
  }

  async deleteById(id) {
    return await this.collection.doc(id).delete();
  }
}

module.exports = ContenedorFirebase;
