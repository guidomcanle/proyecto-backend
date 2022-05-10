const createProds = require("../util/prod.util");

class ProdController {
  constructor() {
    this.createProds = this.createProds.bind(this);
    this.getProds = this.getProds.bind(this);
    this.prods = [];
  }

  async createProds() {
    let id = 0;
    this.prods = [];
    try {
      for (let i = 0; i < 5; i++) {
        id += 1;
        const prods = createProds();
        prods.id = id;
        this.prods.push(prods);
      }
      return this.prods;
    } catch (error) {
      console.log(error);
    }
  }

  async getProds() {
    try {
      return this.prods;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = ProdController;
