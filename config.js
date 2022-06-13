// module.exports = {
//   NODE_ENV: process.env.NODE_ENV || "development",
//   HOST: process.env.HOST || "localhost",
//   PORT: process.env.PORT || 8080,
// };
const path = require("path");
const dotenv = require("dotenv");
const parseArgs = require("minimist");

function param(p) {
  const index = process.argv.indexOf(p);
  return process.argv[index + 1];
}

const mod = param("--mod");
console.log(mod);

dotenv.config({
  path:
    mod == "dev"
      ? path.resolve(__dirname, "1.env")
      : path.resolve(__dirname, "2.env"),
});

const modo = process.env.MODO;
const host = process.env.HOST;
const port = process.env.PORT;
const mongoDb = process.env.MONGODB_;

console.log({ modo, host, port, mongoDb });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: host || "localhost",
  PORT: port || 80,
  MONGODB_: mongoDb || "",
};
