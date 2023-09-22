// Payment Lock

const { Client } = require("pg");
const dotenv = require("dotenv");
const xl = require("xlsx");

dotenv.config();

const pgURL = process.env.PG_EXTERNAL_DATABASE_URL;
const dbConfig = {
  connectionString: pgURL,
  ssl: true,
};
const client = new Client(dbConfig);
console.log("Connected to the Database");

client
  .connect()
  .then((res) => {
    console.log("Connected to the Database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

const getFees = async () => {
  const fees = await client.query("SELECT * FROM FEES");
  fees = fees.rows;
  return fees;
};

const etherealTicket = () => {};

const loadFile = (path) => {
  const book = xl.readFile(path);
  const sheetName = book.SheetNames[0];
  const worksheet = book.Sheets[sheetName];
  const data = xl.utils.sheet_to_json(worksheet);

  return data;
};

const getDbTransactions = async () => {
  try {
    const fees = await getFees();
    console.log(fees);

    const transactions = await client.query("SELECT * FROM transactions");
    console.log(transactions.rows);
  } catch (error) {
    console.log(error);
  }
};

// const data = loadFile("OpTransactionHistoryUX3_XLS21-09-2023.xls");
getDbTransactions();

client.end();
