const { optionsMariaDB } = require("./options/mariaDB");
const knex = require("knex")(optionsMariaDB);

class ContenedorMariaDB {
  async createTable() {
    try {
      await knex.schema.createTable("prods", (table) => {
        table.increments("id");
        table.timestamp("timestamp(productos)").defaultTo(knex.fn.now());
        table.string("nombre");
        table.string("descripcion");
        table.integer("código");
        table.float("precio");
        table.string("foto");
        table.integer("stock");
      });
      console.log("table created");
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      knex.destroy();
    }
  }

  // comentados los destroy porque dan error

  async getAll() {
    try {
      const exist = await knex.schema.hasTable("prods");
      if (!exist) {
        this.createTable();
      }
      return await knex.select("*").from("prods");
    } catch (err) {
      console.log(err);
      throw err;
      //   } finally {
      //     knex.destroy();
      //   }
    }
  }

  async getById(id) {
    try {
      console.log("select pord by id");
      return await knex.from("prods").where({ id: id });
    } catch (err) {
      console.log(err);
      throw err;
      // } finally {
      //   knex.destroy();
    }
  }
  async save({ nombre, descripcion, código, foto, precio, stock }) {
    try {
      const addProd = await knex("prods").insert({
        nombre,
        descripcion,
        código: parseInt(código),
        foto,
        precio: parseFloat(precio),
        stock: parseInt(stock),
      });
      console.log("instert prod");
      return addProd;
    } catch (err) {
      console.log(err);
      throw err;
      // } finally {
      //   knex.destroy();
    }
  }

  async updateProduct(id, nombre, descripcion, código, foto, precio, stock) {
    try {
      const upProd = await knex("prods").where({ id: id }).update({
        nombre,
        descripcion,
        código,
        foto,
        precio,
        stock,
      });
      console.log("Update prod");
      return upProd;
    } catch (err) {
      console.log(err);
      throw err;
      // } finally {
      //   knex.destroy();
    }
  }

  async deleteById(id) {
    try {
      console.log("del prod by id");
      return await knex.from("prods").where({ id: id }).del();
    } catch (err) {
      console.log(err);
      throw err;
      // } finally {
      //   knex.destroy();
    }
  }

  async deleteAll() {
    try {
      console.log("del all prod");
      return await knex.from("prods").del();
    } catch (err) {
      console.log(err);
      throw err;
      //   } finally {
      //     knex.destroy();
    }
  }
}

module.exports = ContenedorMariaDB;
