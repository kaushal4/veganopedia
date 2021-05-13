//setting up connection to mysql

const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kush",
  database: "veganopedia",
});

//connection logic

con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connection to database successfull!!");
});

module.exports = {
  con: con,
};
