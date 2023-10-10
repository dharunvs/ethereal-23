const nodemailer = require("nodemailer");
const { Client } = require("pg");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const pgURL = process.env.PG_EXTERNAL_DATABASE_URL;

const dbConfig = {
  connectionString: pgURL,
  ssl: true,
};
const client = new Client(dbConfig);
client.connect().then((res) => {
  console.log("Connected to the Render Database");
});

const fromEmail = process.env.EMAIL_USER;
const emailTransporter = nodemailer.createTransport({
  // secure: true,
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  // service: process.env.EMAIL_SERVICE,
  auth: {
    user: fromEmail,
    pass: process.env.EMAIL_PASS,
  },
});

const func = async () => {
  const users = await client.query("SELECT * FROM users", []);
  const transactions = await client.query("SELECT * FROM transactions", []);

  const notVerified = [];

  transactions.rows.forEach((transaction) => {
    const user = users.rows.filter((user) => user.id == transaction.user_id)[0];
    const type = transaction.type;
    if (type == "ETHEREAL") {
      if (user.ethereal == null) {
        notVerified.push({ user: user, transaction: transaction });
      }
    } else if (
      type == "IC_CONCERT" ||
      type == "OC_CONCERT" ||
      type == "IC_COMBO_CONCERT"
    ) {
      if (user.concert == null) {
        notVerified.push({ user: user, transaction: transaction });
      }
    } else if (type == "IC_BOTH" || type == "OC_COMBO") {
      if (user.ethereal == null || user.concert) {
        notVerified.push({ user: user, transaction: transaction });
      }
    }
    // notVerified.push(user);
  });

  console.log("Transactions:", notVerified[0]);

  console.log("Transactions:", transactions.rows.length);
  console.log("notVerifiedTransactions:", notVerified.length);
};

func();
