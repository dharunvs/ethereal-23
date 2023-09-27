// const nodemailer = require("nodemailer");

// const { get } = require("https");

// const emailTransporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// otp = 1234;

// const mailOptions = {
//   from: "dharunsivakumar002@gmail.com",
//   to: "dharunsivakumar002@gmail.com",
//   subject: "Your OTP for Registration",
//   text: `Your OTP is: ${otp}`,
// };
// emailTransporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.log("Error sending email:", error);
//   } else {
//     console.log("Email sent:", info.response);
//   }
// });

// function isInnerCollege(email) {
//   const emailParts = email.split("@");
//   if (emailParts[emailParts.length - 1] === "kcgcollege.com") {
//     return true;
//   }
//   return false;
// }

// function parseEmail(email) {
//   const depts = {
//     it: "Information Technology",
//     ad: "Artificial Intelligence and Data Science",
//     cs: "Computer Science",
//     ft: "Fashion Technology",
//     ae: "Aeronautical",
//     sh: "Science and Humanities",
//   };

//   const year = {
//     20: 4,
//     21: 3,
//     22: 2,
//     23: 1,
//   };

//   let message = { department: "Department not found", year: 0 };

//   if (isInnerCollege(email)) {
//     if (depts[email.slice(2, 4)] != undefined) {
//       message.department = depts[email.slice(2, 4)];
//     } else {
//       message.department = "Department not found";
//     }
//     if (year[email.slice(0, 2)] != undefined) {
//       message.year = year[email.slice(0, 2)];
//     } else {
//       message.year = 0;
//     }
//   } else {
//     message.department = "Outer College";
//     message.year = 0;
//   }

//   console.log(message);
// }
// parseEmail("24as09@kcgcollege.com");

const { v4: uuidv4 } = require("uuid");

function createCode() {
  const uniqueId = uuidv4().toString();
  const code = uniqueId.replace(/-/g, "").slice(0, 6);
  return code;
}

console.log(createCode());
