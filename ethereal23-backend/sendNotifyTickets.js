const sendusers2 = [];

const doneUsers = [
  "dharunsivakumar002@gmail.com",
  "20ad40@kcgcollege.com",
  "20cs035@kcgcollege.com",
  "onlysricharan@gmail.com",
];

const nodemailer = require("nodemailer");
const { Client } = require("pg");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const pgURL = process.env.PG_EXTERNAL_DATABASE_URL;

// const dbConfig = {
//   connectionString: pgURL,
//   ssl: true,
// };
// const client = new Client(dbConfig);
// client.connect().then((res) => {
//   console.log("Connected to the Render Database");
// });

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

console.log(doneUsers.length);

const func = async (toSendUsers) => {
  let arr = toSendUsers;

  console.log(arr);

  arr.forEach((user, i) => {
    setTimeout(() => {
      console.log("\n--------------------------------\n");
      console.log(user);

      // //////////////////////////////////////////////////////////
      // //////////////////////////////////////////////////////////
      let htmlContent = fs.readFileSync(
        "./email/sendTickets/index.html",
        "utf8"
      );
      htmlContent = htmlContent.replace("${email_name}", user.user.name);
      htmlContent = htmlContent.replace("${email_ecode}", user.user.ethereal);
      htmlContent = htmlContent.replace(
        "${email_ccode}",
        user.user.concert_code
      );
      const mailOptions = {
        from: { name: "KCG Ethereal", address: fromEmail },
        to: user,
        subject: `KCG Ethereal Notification for ${user} test`,
        html: htmlContent,
      };
      emailTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          res.json({ message: "Failed to send OTP via email", sent: false });
        } else {
          console.log(info);
          res.json({ message: "OTP sent to email", sent: true });
        }
      });
      // //////////////////////////////////////////////////////////
      // //////////////////////////////////////////////////////////
      console.log(i + 1);
      console.log("\n----------------", i + 1, "----------------\n");
    }, i * 1000);
  });
};

func(sendusers2);
