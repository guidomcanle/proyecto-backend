const optionsSqlite = {
  client: "sqlite3",
  connection: {
    filename: "./db/ecommerce.sqlite",
  },
  useNullAsDefault: true,
};

module.exports = {
  optionsSqlite,
};
