const { optionsSqlite } = require("./options/sqlite");
const knex = require("knex")(optionsSqlite);
const moment = require("moment");

class ChatMemorieSqlite {
  async createTable() {
    try {
      await knex.schema.createTable("Mensajes", (table) => {
        table.increments("id");
        table.string("email");
        table.string("message");
        table.string("sent");
      });
      console.log("Tabla creada");
    } catch (err) {
      console.log(err);
    } finally {
      knex.destroy();
    }
  }

  async getHistorial() {
    const exist = await knex.schema.hasTable("Mensajes");
    if (!exist) {
      this.createTable();
    }
    return await knex.from("Mensajes").select("*");
  }

  async saveHistorial(message) {
    try {
      await knex.from("Mensajes").insert({
        email: message.userEmail,
        message: message.message,
        sent: moment(),
      });
    } catch (err) {
      console.log(err);
      // } finally {
      //   knex.destroy();
    }
  }
}

module.exports = ChatMemorieSqlite;
