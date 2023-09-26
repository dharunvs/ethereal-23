// import { quantity, price, allowedOrigins } from "./data";
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const dotenv = require("dotenv");
const { Client } = require("pg");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

dotenv.config();
// const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const paymentMethodDomain = await stripe.paymentMethodDomains.create({
//   domain_name: 'example.com',
// });

const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  // "https://kcgethereal.com",
  "http://localhost:5173",
  // "https://ethereal-test-2023.web.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// const db = new sqlite3.Database("./tmp/db.sqlite3", (err) => {
//   if (err) {
//     console.error("Error opening database:", err.message);
//   } else {
//     connErr = true;
//     console.log("Connected to the database");
//   }
// });
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
  // port: process.env.EMAIL_PORT,
  // host: process.env.EMAIL_HOST,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: fromEmail,
    pass: process.env.EMAIL_PASS,
  },
});

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use("/qr", express.static("./qr"));

// Test stripe
// const price = {
//   ETHEREAL: "price_1NpaRqSFg7MvYkkafGjXJhGS",
//   IC_CONCERT: "price_1NpaTUSFg7MvYkka0z6QOT0Z",
//   OC_CONCERT: "price_1NpaU6SFg7MvYkkaMN8l1yJ8",
//   IC_COMBO_CONCERT: "price_1NpaSWSFg7MvYkkaZfn2L9bh",
//   OC_COMBO_CONCERT: "price_1NpaT4SFg7MvYkkaGb9PYWba",
// };

// Live stripe

// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     // "https://ethereal-test-2023.web.app"
//     "https://kcgethereal.com"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Max-Age", "86400"); // 24 hours
//   next();
// });

const price = {
  ETHEREAL: process.env.PRICE_ETHEREAL,
  IC_CONCERT: process.env.PRICE_IC_CONCERT,
  OC_CONCERT: process.env.PRICE_OC_CONCERT,
  IC_COMBO_CONCERT: process.env.PRICE_IC_COMBO_CONCERT,
  OC_COMBO_CONCERT: process.env.PRICE_OC_COMBO_CONCERT,
  // IC_BOTH: process.env.PRICE_IC_COMBO_CONCERT
};

const quantity = 1;

//PayTm
app.post("/initiateTransaction", async (req, res) => {
  const { email, type, events, comboEligible } = req.body;
  let innerClg = isInnerCollege(email);
  let items = [];
  let amount = 0;
  if (type == 1) {
    amount += price.ETHEREAL;
    items.push({ price: price.ETHEREAL, quantity: quantity });
  } else if (type == 2) {
    if (comboEligible) {
      if (innerClg) {
        amount += price.IC_COMBO_CONCERT;
        items.push({ price: price.IC_COMBO_CONCERT, quantity: quantity });
      } else {
        amount += price.OC_COMBO_CONCERT;
        items.push({ price: price.OC_COMBO_CONCERT, quantity: quantity });
      }
    } else {
      if (innerClg) {
        amount += price.IC_CONCERT;
        items.push({ price: price.IC_CONCERT, quantity: quantity });
      } else {
        amount += price.OC_CONCERT;
        items.push({ price: price.OC_CONCERT, quantity: quantity });
      }
    }
  } else if (type == 3) {
    items.push({ price: price.ETHEREAL, quantity: quantity });
    if (innerClg) {
      items.push({ price: price.IC_CONCERT, quantity: quantity });
    } else {
      items.push({ price: price.OC_CONCERT, quantity: quantity });
    }
  }

  // console.log("----> ", amount);

  // Live test product
  items = [{ price: "price_1NpdMMSFg7MvYkka8i7GiEmW", quantity: 1 }];

  try {
    // const paymentMethodDomain = await stripe.paymentMethodDomains.validate(
    //   "pmd_1NpefrSFg7MvYkkaADJjYTKC"
    // );
    // console.log(await paymentMethodDomain);

    const session = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      // payment_method_types: ["card","],
      // automatic_payment_methods: {
      //   enabled: true,
      // },
      success_url: `${allowedOrigins[0]}/success`,
      cancel_url: `${allowedOrigins[0]}/failed`,
    });

    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount,
    //   currency: "inr",
    //   automatic_payment_methods: {
    //     enabled: true,
    //   },
    //   // payment_method_configuration: 'pmc_123',
    // });

    // res.json({ client_secret: paymentIntent.client_secret });
    console.log(session.url);
    res.send({ url: session.url });
  } catch {
    res.json({ message: "Stripe fail" });
  }

  // res.redirect(303, session.url);

  // db.get("SELECT * FROM users WHERE id=?", [id], (err, row) => {
  //   if (err) {
  //     res.status(500).json({ message: "Error fetching user" });
  //   } else {
  //     user = row;
  //     console.log(user);

  // db.get("SELECT * FROM fees", [], (err, row) => {
  //   let amount = 0;
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     // -----------------------------
  //     // -----------------------------

  //     let items = [];

  //     price = row;
  //     console.log(price);
  // if (type == 1) {
  //   amount += price.ETHEREAL;
  // } else if (type == 2) {
  //   if (innerClg) {
  //     amount += price.IC_CONCERT;
  //   } else {
  //     amount += price.OC_CONCERT;
  //   }
  // } else if (type == 3) {
  //   amount += price.ETHEREAL;
  //   if (innerClg) {
  //     amount += price.IC_CONCERT;
  //   } else {
  //     amount += price.OC_CONCERT;
  //   }
  // }

  //     console.log(amount);

  //     // -----------------------------
  //     // -----------------------------
  //   }
  // });
  // }

  // -----------------------------------------------------
  // -----------------------------------------------------

  // });

  // const paytmParams = {
  //   body: {
  //     requestType: "Payment",
  //     mid: "YOUR_MID_HERE",
  //     websiteName: "YOUR_WEBSITE_NAME",
  //     orderId: "ORDERID_98765",
  //     callbackUrl: "https://<callback URL to be used by merchant>",
  //     txnAmount: {
  //       value: "1.00",
  //       currency: "INR",
  //     },
  //     userInfo: {
  //       custId: "CUST_001",
  //     },
  //   },
  // };

  // try {
  //   const checksum = await PaytmChecksum.generateSignature(
  //     JSON.stringify(paytmParams.body),
  //     "YOUR_MERCHANT_KEY"
  //   );

  //   paytmParams.head = {
  //     signature: checksum,
  //   };

  //   const post_data = JSON.stringify(paytmParams);

  // const options = {
  //   /* for Staging */
  //   // hostname: "securegw-stage.paytm.in",

  //   /* for Production */
  //   // hostname: 'securegw.paytm.in',

  //   port: 443,
  //   path: "/theia/api/v1/initiateTransaction?mid=YOUR_MID_HERE&orderId=ORDERID_98765",
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Content-Length": post_data.length,
  //   },
  // };

  // let response = "";
  // const post_req = https.request(options, (post_res) => {
  //   post_res.on("data", (chunk) => {
  //     response += chunk;
  //   });

  //   post_res.on("end", () => {
  //     console.log("Response: ", response);
  //     res.status(200).json({ response });
  //   });
  // });

  // post_req.write(post_data);
  // post_req.end();
  // } catch (error) {
  //   console.error("Error:", error);
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
});

// Send Login otp
app.post("/send-otp", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  const otp = randomstring.generate({
    length: 4,
    charset: "numeric",
  });

  try {
    const queryResult = await client.query(
      "SELECT otp FROM users WHERE email = $1",
      [email]
    );
    const row = queryResult.rows[0];

    if (!row) {
      const id = uuidv4();
      const { name, phone, college } = req.body;

      await client.query(
        "INSERT INTO users (id, name, email, phone, otp, college) VALUES ($1, $2, $3, $4, $5, $6)",
        [id, name, email, phone, otp, college]
      );
    } else {
      await client.query("UPDATE users SET otp = $1 WHERE email = $2", [
        otp,
        email,
      ]);
    }
    await sendMailOTP(email, otp);
    res.json({ message: "OTP Updated in database", ok: true });
  } catch (error) {
    console.error(error);
    res.json({ message: "Failed to update OTP in database", ok: false });
  }

  // Send OTP to email
  async function sendMailOTP(EMAIL, OTP) {
    const mailOptions = {
      from: { name: "KCG Ethereal", address: fromEmail },
      to: EMAIL,
      subject: `OTP Verification ${OTP}`,
      // text: `Your OTP for login is: ${OTP}`,
      html: `<p>Your OTP for login is: ${OTP}</p>`,
      // attachments: [
      //   {
      //     filename: "profile.webp", // The name of the attached file
      //     path: "./qr/ETHEREAL.webp", // The path to your profile picture file
      //     cid: "unique_cid", // Content-ID (cid) for referencing in the HTML body
      //   },
      // ],
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
  }
});

app.post("/userEvents", async (req, res) => {
  const { userId } = req.body;

  try {
    const teams = await client.query("SELECT * FROM TEAMS", []);
    let filtered = teams.rows.filter((team) => team.lead === userId);
    if (filtered.length <= 0) {
      filtered = teams.rows.filter(
        (team) =>
          team.members !== null &&
          team.members.some((member) => member === userId)
      );
    }

    res.json({ events: filtered });
  } catch (error) {
    console.log(error);
  }
});

// Get events
app.post("/events", async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    // const userQuery = await client.query(
    //   "SELECT events from users WHERE id = $1",
    //   [userId]
    // );

    // const college = getCollegeById(userId);
    let college = await client.query(
      "SELECT college FROM users WHERE id = $1",
      [userId]
    );
    // console.log("-- 101 --> ", );
    if (college.rows[0] != undefined) {
      college = college.rows[0].college;
    } else {
      college = "";
    }

    const query = await client.query(
      "SELECT * FROM teams WHERE event = $1 AND college = $2",
      [eventId, college]
    );

    let filtered = query.rows.filter((team) => team.lead === userId);
    if (filtered.length <= 0) {
      filtered = query.rows.filter(
        (team) =>
          team.members !== null &&
          team.members.some((member) => member === userId)
      );
    }

    console.log("--- 3 -->", query.rows);
    // console.log("--- 3 -->", team.members);
    console.log(filtered);

    if (filtered.length > 0) {
      res.json({ found: true, team: filtered[0] });
    } else {
      filtered = query.rows.filter((team) => team.lead === userId);
      res.json({ found: false });
    }

    return;

    // if(query.rowCount)

    // if (query.rowCount <=0){
    //   query = await client.query(

    //   )
    // }

    // console.log(userQuery.rows[0]["events"]);
    // res.json(JSON.parse(userQuery.rows[0]["events"]));
  } catch (error) {
    console.log(error);
  }
});

app.post("/events/:id", async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  try {
    // const college = getCollegeById(userId);
    let college = await client.query(
      "SELECT college FROM users WHERE id = $1",
      [userId]
    );
    // console.log("-- 101 --> ", );
    college = college.rows[0].college;
    const query = await client.query(
      "SELECT * from teams WHERE event = $1 AND college = $2",
      [eventId, college]
    );
    console.log(query.rows);
    res.json(query.rows);
  } catch (error) {
    console.log(error);
  }
});

app.post("/events/:id/register", async (req, res) => {
  const eventId = req.params.id;
  const { userId, teamName } = req.body;

  console.log(userId, teamName);

  try {
    if (teamName.trim() !== "") {
      const teams = await client.query(
        "SELECT name FROM teams where event = $1",
        [eventId]
      );

      if (teams.rows.some((team) => team.name === teamName)) {
        res.json({ message: "Team already exists with same name" });
        return;
      }

      // let college = getCollegeById(userId);
      let college = await client.query(
        "SELECT college FROM users WHERE id = $1",
        [userId]
      );
      // console.log("-- 101 --> ", );
      college = college.rows[0].college;
      console.log("-- 102 --> ", college);

      const teamId = "team_" + uuidv4().toString();
      console.log(teamId);
      await client.query(
        "INSERT INTO teams (id, name, college, event, lead) VALUES ($1, $2, $3, $4, $5)",
        [teamId, teamName, college, eventId, userId]
      );
    }
    res.json({ message: "Hello" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/events/:id/join", async (req, res) => {
  const eventId = req.params.id;
  const { userId, team } = req.body;

  try {
    const event = await client.query(
      "SELECT * from events where event_id = $1",
      [eventId]
    );

    // const college = getCollegeById(userId);

    let college = await client.query(
      "SELECT college FROM users WHERE id = $1",
      [userId]
    );
    college = college.rows[0].college;
    let members =
      team.members !== null ? team.members : team.members == null ? [] : null;

    if (members.length < event.rows[0].max) {
      if (college == team.college) {
        members.push(userId);
        const update = await client.query(
          "UPDATE teams SET members = $1 WHERE id = $2",
          [members, team.id]
        );
      }
    }
  } catch (error) {
    console.log(error);
  }

  res.json({ message: "jon" });
});

app.post("/users", async (req, res) => {
  const { ids } = req.body;
  let arr = [];

  const users = await client.query("SELECT name, id FROM users", []);
  ids.forEach((id) => {
    const filtered = users.rows.filter((user) => user.id == id);
    arr.push(filtered[0]);
  });

  res.json({ userIds: arr });
});

app.post("/removeTeamate", async (req, res) => {});

// app.post("/team", async (req, res) => {
//   const {teamId} = req.body;

//   try {
//     const team =
//   }
// })

// Login
app.post("/login", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const userQuery = await client.query(
      "SELECT id, otp FROM users WHERE email = $1",
      [email]
    );

    // if (userQuery.rows.length === 0) {
    //   res.json({ message: "User not found" });
    //   return;
    // }

    const row = userQuery.rows[0];
    const dbOtp = row.otp != null ? row.otp.toString() : "";

    if (dbOtp === otp.toString()) {
      await client.query(
        "UPDATE users SET otp = NULL, logged_in = TRUE WHERE email = $1",
        [email]
      );

      res.json({
        message: "Login successful",
        loggedIn: true,
        email: email,
        id: row.id,
        // verified: true,
      });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

//Logout
app.post("/logout", (req, res) => {
  const { id } = req.body;

  db.run(
    "UPDATE users SET otp=NULL, logged_in=FALSE WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to logout" });
      } else {
        res.json({
          message: "Logout successful",
          loggedIn: false,
          email: email,
          id: id,
        });
      }
    }
  );
});

// ---------------------- Checker Functions ----------------------

app.post("/check-new", async (req, res) => {
  const { email } = req.body;

  try {
    const userQuery = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      res.json({ message: "NewUser" });
    } else {
      res.json({ message: "OldUser" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking user status" });
  }
});

app.post("/check-loggedin", async (req, res) => {
  const { id } = req.body;

  try {
    const userQuery = await client.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (userQuery.rows.length === 0) {
      res.json({ message: "User not found" });
      return;
    }

    const row = userQuery.rows[0];
    row.isInnerCollege = isInnerCollege(row.email);

    const emailParse = parseEmail(row.email);
    row.department = emailParse.department;
    row.year = emailParse.year;

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking user login status" });
  }
});

app.post("/getQR", (req, res) => {
  const { type } = req.body;

  try {
    const imagePath = `./qr/${type}.webp`;
    const image = fs.readFileSync(imagePath);
    res.contentType("image/jpeg");
    res.send(image);
  } catch (error) {
    console.log(error);
  }
});

app.get("/getQR/:type", (req, res) => {
  const type = req.params.type;
  const imagePath = path.join(__dirname, "qr/" + type + ".webp"); // Replace with your image path
  res.sendFile(imagePath);
});

app.post("/transaction", async (req, res) => {
  const { userId, type } = req.body;
  let { transactionId } = req.body;

  transactionId = transactionId.trim();

  if (transactionId !== "") {
    try {
      const transactions = await client.query("SELECT * from transactions");
      let found = false;
      let sameTypeSameUser = false;
      let tid = "";
      if (transactions.rowCount > 0) {
        transactions.rows.forEach((row) => {
          if (row.transaction_id == transactionId) {
            found = true;
            return;
          } else if (row.user_id == userId && row.type == type) {
            sameTypeSameUser = true;
            tid = row.transaction_id;
            return;
          }
        });
      } else {
        found = false;
      }

      if (found) {
        res.json({ message: "Invalid transaction id" });
        return;
      } else if (sameTypeSameUser) {
        res.json({ message: "Already Submitted", tid: tid });
      } else {
        client.query(
          "INSERT INTO transactions (transaction_id, user_id, type) VALUES ($1, $2, $3)",
          [transactionId, userId, type]
        );
        res.json({ message: "Success" });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json({ message: "Failure" });
  }
});

// Base url
app.get("/", (req, res) => {
  res.json({
    name: "ethereal23-backend",
    version: "1.0.3",
    description: "",

    keywords: [],
    author: "Dharun Sivakumar",
    dependencies: {
      cors: "^2.8.5",
      dotenv: "^16.3.1",
      express: "^4.18.2",
      nodemailer: "^6.9.4",
      randomstring: "^1.3.0",
      readline: "^1.3.0",
      sqlite3: "^5.1.6",
      uuid: "^9.0.0",
    },
  });
});

// Admin APIS
app.get("/get-fees", async (req, res) => {
  try {
    const query = await client.query("SELECT * FROM fees", []);
    res.json(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

// ---------------------- Helper Functions ----------------------

const getCollegeById = async (id) => {
  try {
    const college = await client.query(
      "SELECT college FROM users WHERE id = $1",
      [id]
    );
    return college.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCollegeByEmail = async (email) => {
  try {
    const college = await client.query(
      "SELECT college FROM users WHERE email = $1",
      [email]
    );
    return college;
  } catch (error) {
    console.log(error);
    return null;
  }
};

function isInnerCollege(email) {
  const emailParts = email.split("@");
  if (emailParts[emailParts.length - 1] === "kcgcollege.com") {
    return true;
  }
  return false;
}

function parseEmail(email) {
  const depts = {
    it: "Information Technology",
    ad: "Artificial Intelligence and Data Science",
    cs: "Computer Science and Engineering",
    ft: "Fashion Technology",
    ae: "Aeronautical",
    at: "Automobile",
    ce: "Civil",
    ec: "Electronics and Communication Engineering",
    ee: "Electrical and Electronic Engineering",
    ei: "Electronics and Instrumentation Engineering",
    mc: "Mechatronics",
    ao: "Aerospace",
    me: "Mechanical",
    sh: "Science and Humanities",
  };

  const year = {
    20: 4,
    21: 3,
    22: 2,
    23: 1,
  };

  let message = { department: "Department not found", year: 0 };

  if (isInnerCollege(email)) {
    if (depts[email.slice(2, 4)] != undefined) {
      message.department = depts[email.slice(2, 4)];
    } else {
      message.department = "Department not found";
    }
    if (year[email.slice(0, 2)] != undefined) {
      message.year = year[email.slice(0, 2)];
    } else {
      message.year = 0;
    }
  } else {
    message.department = "Outer College";
    message.year = 0;
  }

  return message;
}

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

app.get("/config", async (req, res) => {
  try {
    const query = await client.query(
      "SELECT * FROM config WHERE role = 'admin'"
    );
    console.log(query.rows[0]);
    res.json(query.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

const xl = require("xlsx");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file received" });
  }

  let arr = [];
  let verifiedUsers = [];
  let doneUsers = [];
  let notDoneUsers = [];

  // Process the uploaded file here
  let transactions = loadFile(req.file.buffer);
  transactions = transactions.slice(5);

  transactions.forEach((t) => {
    console.log("-- 97 -->", t);

    const tid = t["__EMPTY_2"].split("/")[1];
    const refname = t["__EMPTY_2"].split("/")[3];
    arr.push({
      tid: tid,
      amount: t["__EMPTY_7"],
      time: t["Statement of Account"],
      refname: refname,
    });
  });
  console.log("-- 98 -->", arr);

  try {
    const fees = await client.query("SELECT * FROM FEES");
    console.log(fees.rows[0]);

    const DbTransactions = await client.query("SELECT * FROM transactions");
    console.log(DbTransactions.rows);

    DbTransactions.rows.forEach((dt) => {
      const ft = arr.find((t) => t.tid == dt.transaction_id);
      console.log("-- 99 -->", ft);
      if (ft.tid != undefined) {
        console.log(
          ft.amount,
          fees[dt.type.toLowerCase()],
          dt.type,
          dt.type.toLowerCase(),
          fees.rows[0]["oc_concert"],
          fees.rows[0][dt.type.toLowerCase()]
        );
        if (ft.amount == fees.rows[0][dt.type.toLowerCase()] + 10) {
          verifiedUsers.push({
            userId: dt.user_id,
            type: dt.type,
            transactionId: ft.tid,
          });
        } else {
          console.log("User not verified");
        }
      }
    });

    console.log(verifiedUsers);
  } catch (error) {
    console.log(error);
  }

  verifiedUsers.forEach(async (user) => {
    if (user.type == "ETHEREAL") {
      const ethCode = createCode();

      try {
        await client.query("UPDATE users SET ethereal= $1 WHERE id = $2", [
          ethCode,
          user.userId,
        ]);
        doneUsers.push(user);
      } catch (err) {
        notDoneUsers.push(user);
        console.log(err);
      }

      console.log(ethCode);
    } else if (
      user.type == "IC_CONCERT" ||
      user.type == "OC_CONCERT" ||
      user.type == "IC_COMBO_CONCERT"
    ) {
      const conCode = createCode();
      const conTicket = createConcert();

      try {
        await client.query("UPDATE users SET concert_code= $1 WHERE id = $2", [
          conCode,
          user.userId,
        ]);
        await client.query("UPDATE users SET concert= $1 WHERE id = $2", [
          conTicket,
          user.userId,
        ]);
        doneUsers.push(user);
      } catch (err) {
        notDoneUsers.push(user);
        console.log(err);
      }

      console.log(conCode);
      console.log(conTicket);
    } else if (user.type == "IC_BOTH" || user.type == "OC_COMBO") {
      const ethCode = createCode();
      const conCode = createCode();
      const conTicket = createConcert();

      try {
        await client.query("UPDATE users SET ethereal= $1 WHERE id = $2", [
          ethCode,
          user.userId,
        ]);
        await client.query("UPDATE users SET concert_code= $1 WHERE id = $2", [
          conCode,
          user.userId,
        ]);
        await client.query("UPDATE users SET concert= $1 WHERE id = $2", [
          conTicket,
          user.userId,
        ]);
        doneUsers.push(user);
      } catch (err) {
        notDoneUsers.push(user);
        console.log(err);
      }

      console.log(ethCode);
      console.log(conCode);
      console.log(conTicket);
    }
  });

  // console.log(arr);
  // You can do whatever you need with the file data here
  // For example, save it to disk or database

  return res.status(200).json({ message: "File uploaded successfully" });
});

const loadFile = (file) => {
  const book = xl.read(file);
  const sheetName = book.SheetNames[0];
  const worksheet = book.Sheets[sheetName];
  const data = xl.utils.sheet_to_json(worksheet);

  return data;
};

const createConcert = () => {
  const uuid = uuidv4().toString();
  const ticket = "concert_" + uuid;
  return ticket;
};

function createCode() {
  const uniqueId = uuidv4().toString();
  const code = uniqueId.replace(/-/g, "").slice(0, 6);
  return code;
}

app.get("/export-csv", async (req, res) => {
  try {
    // Query to select data from a table (replace 'your_table' with the actual table name)
    const query = "SELECT * FROM users";
    const result = await client.query(query);

    // Convert the result to CSV format
    const csvData = result.rows.map((row) => Object.values(row).join(","));

    // Save the CSV data to a file
    fs.writeFileSync("output.csv", csvData.join("\n"));

    res.send("CSV file exported successfully.");
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).send("Error exporting CSV");
  }
});

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
