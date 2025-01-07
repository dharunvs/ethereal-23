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

const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "https://kcgethereal.com",
  "http://localhost:5173",
  // "https://ethereal-test-2023.web.app",
  "https://ethereal-81f2e.web.app",
  undefined,
  "undefined",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS -> " + origin));
    }
  },
};

const pgURL = process.env.PG_EXTERNAL_DATABASE_URL;
const dbConfig = {
  connectionString: pgURL,
  ssl: true,
};
// const client = new Client(dbConfig);
const client = new Client({
  host: "localhost",
  password: "061297",
  database: "ethereal",
  port: 5432,
  user: "postgres",
});

client.connect().then((res) => {
  console.log("Connected to the Render Database");
});

const fromEmail = process.env.EMAIL_USER;
const emailTransporter = nodemailer.createTransport({
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  auth: {
    user: fromEmail,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Email host:", process.env.EMAIL_HOST);

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use("/qr", express.static("./qr"));

const price = {
  ETHEREAL: process.env.PRICE_ETHEREAL,
  IC_CONCERT: process.env.PRICE_IC_CONCERT,
  OC_CONCERT: process.env.PRICE_OC_CONCERT,
  IC_COMBO_CONCERT: process.env.PRICE_IC_COMBO_CONCERT,
  OC_COMBO_CONCERT: process.env.PRICE_OC_COMBO_CONCERT,
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("Origin -->", origin);

  if (allowedOrigins.includes(origin) || true) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "86400"); // 24 hours
  next();
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
      html: `<p>Your OTP for login is: ${OTP}</p>`,
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
    let college = await client.query(
      "SELECT college FROM users WHERE id = $1",
      [userId]
    );
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

    if (filtered.length > 0) {
      res.json({ found: true, team: filtered[0] });
    } else {
      filtered = query.rows.filter((team) => team.lead === userId);
      res.json({ found: false });
    }

    return;
  } catch (error) {
    console.log(error);
  }
});

app.post("/events/:id", async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  try {
    let college = await client.query(
      "SELECT college FROM users WHERE id = $1",
      [userId]
    );
    college = college.rows[0].college;
    const query = await client.query(
      "SELECT * from teams WHERE event = $1 AND college = $2",
      [eventId, college]
    );
    res.json(query.rows);
  } catch (error) {
    console.log(error);
  }
});

app.post("/events/:id/register", async (req, res) => {
  const eventId = req.params.id;
  const { userId, solo } = req.body;
  let { teamName } = req.body;

  console.log(userId, teamName, solo);
  if (solo) {
    teamName = userId + "-" + eventId;
  }

  try {
    if (teamName.trim() !== "" || true) {
      const teams = await client.query(
        "SELECT name FROM teams where event = $1",
        [eventId]
      );

      if (teams.rows.some((team) => team.name === teamName)) {
        res.json({
          message: "Team already exists with same name" + teamName + "<>",
        });
        return;
      }

      let college = await client.query(
        "SELECT college FROM users WHERE id = $1",
        [userId]
      );
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

app.post("/events/:id/remove", async (req, res) => {
  try {
    const { teamId, memberId } = req.body;

    const resp = await client.query("SELECT * FROM teams WHERE id = $1", [
      teamId,
    ]);
    const team = resp.rows[0];
    const members = team.members.filter((member) => member !== memberId);

    await client.query("UPDATE teams SET members = $1 WHERE id = $2", [
      members,
      teamId,
    ]);

    res.send({ data: team });
  } catch (error) {
    console.log(error);
  }
});

app.post("/users", async (req, res) => {
  const { ids } = req.body;
  let arr = [];

  const users = await client.query("SELECT name, id, ethereal FROM users", []);
  ids.forEach((id) => {
    const filtered = users.rows.filter((user) => user.id == id);
    const sendData = {
      name: filtered[0].name,
      id: filtered[0].id,
      verified: filtered[0].ethereal == null ? false : true,
    };
    arr.push(sendData);
  });

  res.json({ userIds: arr });
});

// Login
app.post("/login", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const userQuery = await client.query(
      "SELECT id, otp FROM users WHERE email = $1",
      [email]
    );

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
            if (row.user_id == userId && row.type == type) {
              sameTypeSameUser = true;
              tid = row.transaction_id;
              return;
            }
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

      if (sameTypeSameUser) {
        res.json({ message: "Already Submitted", tid: tid });
        return;
      } else if (found) {
        res.json({ message: "Invalid transaction id" });
        return;
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

app.get("/export-csv-users", async (req, res) => {
  try {
    const query =
      "SELECT id, name, email, phone, college from users where logged_in = true";
    const result = await client.query(query);

    const csvData = result.rows.map((row) => Object.values(row).join(","));

    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).send("Error exporting CSV");
  }
});

app.get("/admin-tcount-users", async (req, res) => {
  try {
    const query =
      "SELECT name, email, ethereal, concert_code FROM users WHERE (ethereal <> '' OR concert_code <> '');";
    const result = await client.query(query);

    const csvData = result.rows.map((row) => {
      row = {
        name: row.name,
        email: row.email,
        ethereal: `'${row.ethereal}'`,
        concert_code: `'${row.concert_code}'`,
      };
      return Object.values(row).join(",");
    });

    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).send("Error exporting CSV");
  }
});

app.post("/admin-tcount-users-specific", async (req, res) => {
  try {
    const { type } = req.body;
    let query = "";

    if (type == "ic_ethereal") {
      query =
        "SELECT name, email, ethereal, concert_code FROM users WHERE ethereal <> '' AND email like '%@kcgcollege.com' AND first_year = FALSE";
    } else if (type == "oc_ethereal") {
      query =
        "SELECT name, email, ethereal, concert_code FROM users WHERE ethereal <> '' AND email not like '%@kcgcollege.com' AND first_year = FALSE";
    } else if (type == "ic_concert") {
      query =
        "SELECT name, email, ethereal, concert_code FROM users WHERE concert like 'concert_%' AND email like '%@kcgcollege.com' AND first_year = FALSE";
    } else if (type == "oc_concert") {
      query =
        "SELECT name, email, ethereal, concert_code FROM users WHERE concert like 'concert_%' AND email not like '%@kcgcollege.com' AND first_year = FALSE";
    } else if (type == "fy_eth") {
      query =
        "SELECT name, email, ethereal, concert_code FROM users WHERE first_year = TRUE AND ethereal <> '' AND concert_code IS NULL";
    } else if (type == "fy_con") {
      query =
        "SELECT name, email, ethereal, concert_code FROM users WHERE first_year = TRUE AND concert_code <> '' AND ethereal IS NULL";
    } else if (type == "fy_combo") {
      query =
        "SELECT name, email, ethereal, concert_code FROM users WHERE first_year = TRUE AND (ethereal <> '' OR concert_code <> '')";
    }

    const result = await client.query(query);

    const csvData = result.rows.map((row) => {
      row = {
        name: row.name,
        email: row.email,
        ethereal: `'${row.ethereal}'`,
        concert_code: `'${row.concert_code}'`,
      };
      return Object.values(row).join(",");
    });

    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).send("Error exporting CSV");
  }
});

app.get("/admin-desklist-ic", async (req, res) => {
  try {
    const query =
      "SELECT name, email, ethereal, concert_code FROM users WHERE (ethereal <> '' OR concert <> '') AND (email like '%@kcgcollege.com%' OR first_year = TRUE)";
    const result = await client.query(query);

    const csvData = result.rows.map((row) => {
      row = {
        name: row.name,
        email: row.email,
        ethereal: `'${row.ethereal}'`,
        concert_code: `'${row.concert_code}'`,
      };
      return Object.values(row).join(",");
    });

    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("/admin-desklist-ic:", error);
    res.status(500).send("/admin-desklist-ic");
  }
});

app.get("/admin-qr-db", async (req, res) => {
  try {
    const query = "SELECT name, concert FROM users WHERE concert <> ''";
    const result = await client.query(query);

    const csvData = result.rows.map((row) => {
      row = {
        name: row.name,
        concert: row.concert,
      };
      return Object.values(row).join(",");
    });

    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("/admin-qr-db:", error);
    res.status(500).send("/admin-qr-db");
  }
});

app.get("/admin-desklist-oc", async (req, res) => {
  try {
    const query =
      "SELECT name, email, ethereal, concert_code FROM users WHERE (ethereal <> '' OR concert <> '') AND (email not like '%@kcgcollege.com%' AND first_year = FALSE)";
    const result = await client.query(query);

    const csvData = result.rows.map((row) => {
      row = {
        name: row.name,
        email: row.email,
        ethereal: `'${row.ethereal}'`,
        concert_code: `'${row.concert_code}'`,
      };
      return Object.values(row).join(",");
    });

    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("/admin-desklist-ic:", error);
    res.status(500).send("/admin-desklist-ic");
  }
});

app.get("/admin-events", async (rew, res) => {
  try {
    const query = "SELECT * from events";
    const result = await client.query(query);
    res.send({ data: result.rows });
  } catch {
    res.status(500).send("Error");
  }
});

app.post("/admin-events-participants", async (req, res) => {
  try {
    const { eventId, eventName } = req.body;
    const users = await client.query(
      "SELECT name, email, phone, id, ethereal FROM users",
      []
    );

    const query = "SELECT * from teams where event = $1";
    const result = await client.query(query, [eventId]);

    let rawData = result.rows;
    let data = [];

    rawData.forEach((team) => {
      const leadId = team.lead;
      const membersId = team.members;

      let leadPaid = "";
      let leadName = "";
      let leadEmail = "";
      let leadPhone = "";

      if (leadId != null) {
        const user = users.rows.filter((user) => user.id == leadId)[0];
        if (user == undefined) {
          leadName = "--";
          leadEmail = "--";
          leadPhone = "--";
        } else {
          leadPaid = user.ethereal != null ? "" : " (unpaid)";
          leadName = user.name + leadPaid;
          leadEmail = user.email;
          leadPhone = user.phone;
        }

        let members = [];
        if (membersId != null) {
          membersId.forEach((id) => {
            const filtered = users.rows.filter((user) => user.id == id);
            if (filtered[0] == undefined) {
              members.push("--");
            } else {
              const paid = filtered[0].ethereal != null ? "" : " (unpaid)";
              members.push(filtered[0].name + paid);
            }
          });
        }

        const teamData = {
          name: team.name,
          college: team.college,
          leadName: leadName,
          leadEmail: leadEmail,
          leadPhone: leadPhone,
          members: members,
        };
        console.log(teamData);
        data.push(teamData);
      }
    });

    const csvData = data.map((row) => Object.values(row).join(","));

    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).send("Error exporting CSV");
  }
});

app.get("/admin-config", async (req, res) => {
  try {
    const config = (await client.query("SELECT * from config", [])).rows[0];
    res.send({ data: config });
  } catch {
    res.status(500).send("Error /admin-payments");
  }
});

app.post("/admin-pause-payments", async (req, res) => {
  try {
    const { state } = req.body;

    await client.query("UPDATE config SET pause_payments= $1", [state]);
    res.send({ message: "Done" });
  } catch {
    res.status(500).send("Error /admin-pause-payments");
  }
});

app.get("/admin-tcount", async (req, res) => {
  try {
    const ie = await client.query(
      "SELECT count(*) FROM users WHERE ethereal <> '' AND email like '%@kcgcollege.com' AND first_year = FALSE",
      []
    );
    const oe = await client.query(
      "SELECT count(*) FROM users WHERE ethereal <> '' AND email not like '%@kcgcollege.com' AND first_year = FALSE",
      []
    );
    const ic = await client.query(
      "SELECT count(*) FROM users WHERE concert like 'concert_%' AND email like '%@kcgcollege.com' AND first_year = FALSE",
      []
    );
    const oc = await client.query(
      "SELECT count(*) FROM users WHERE concert like 'concert_%' AND email not like '%@kcgcollege.com' AND first_year = FALSE",
      []
    );
    const fy_eth = await client.query(
      "SELECT count(*) FROM users WHERE first_year = TRUE AND ethereal <> '' AND concert_code IS NULL",
      []
    );
    const fy_con = await client.query(
      "SELECT count(*) FROM users WHERE first_year = TRUE AND concert <> '' AND ethereal IS NULL",
      []
    );
    const fy_combo = await client.query(
      "SELECT count(*) FROM users WHERE first_year = TRUE AND (ethereal <> '' OR concert <> '')",
      []
    );
    const usersLoggedIn = await client.query(
      "SELECT count(*) FROM users WHERE logged_in = TRUE",
      []
    );
    const tcount = {
      ic_ethereal: ie.rows[0].count,
      oc_ethereal: oe.rows[0].count,
      ic_concert: ic.rows[0].count,
      oc_concert: oc.rows[0].count,
      fy_eth: fy_eth.rows[0].count,
      fy_con: fy_con.rows[0].count,
      fy_combo: fy_combo.rows[0].count,
      usersLoggedIn: usersLoggedIn.rows[0].count,
    };
    res.send({ data: tcount });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error /admin-tcount");
  }
});

app.get("/admin-deptwise-count", async (req, res) => {
  try {
    console.log("Hello");
    const query = `SELECT * FROM users WHERE email like '%kcgcollege.com' AND (ethereal <> '' OR concert_code <> '');`;

    const result = await client.query(query, []);

    let rawData = result.rows;

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
      // sh: "Science and Humanities",
    };

    const years = [22, 21, 20];
    const yearName = ["1st Year", "2nd Year", "3rd Year"];
    const deptKeys = Object.keys(depts);

    const yearwise = [];
    years.forEach((year) => {
      const deptwise = [];
      Object.keys(depts).map((code, key) => {
        const filtered = rawData.filter(
          (user) =>
            user.email.slice(0, 2) == year && user.email.slice(2, 4) == code
        );
        deptwise.push(filtered);
      });
      yearwise.push(deptwise);
    });

    rows = [];
    yearwise.forEach((year, key) => {
      rows.push({ name: yearName[key] });
      year.forEach((dept, key) => {
        rows.push({ name: depts[deptKeys[key]] });

        dept.forEach((user) => {
          const userData = {
            name: user.name,
            email: user.email,
            ethereal: user.ethereal == null ? "" : user.ethereal,
            concert: user.concert_code == null ? "" : user.concert_code,
          };
          rows.push(userData);
        });
        rows.push({ dept: "" });
      });
      rows.push({ year: "" });
    });

    const csvData = rows.map((row) => Object.values(row).join(","));
    res.send(csvData.join("\n"));
  } catch {
    res.status(500).send("Error /admin-deptwise-count");
  }
});

app.post("/admin-checkuser", async (req, res) => {
  try {
    const { email } = req.body;
    const resp = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (resp.rowCount > 0) {
      res.send({
        exists: true,
        ethereal: resp.rows[0].ethereal == null ? false : true,
        concert: resp.rows[0].concert_code == null ? false : true,
      });
    } else {
      res.send({ exists: false });
    }
  } catch {
    res.status(500).send("Error /admin-checkuser");
  }
});

app.post("/admin-createuser", async (req, res) => {
  try {
    const { email, name, college, phone, firstYear } = req.body;

    const resp = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (resp.rowCount > 0) {
      res.send({ mess: "Email already exists" });
    } else {
      const id = uuidv4();
      await client.query(
        "INSERT INTO users(id, name, email, phone, college, first_year) VALUES($1, $2, $3, $4, $5, $6)",
        [id, name, email, phone, college, firstYear]
      );
      res.send({ mess: "Created user" });
    }
  } catch {
    res.status(500).send("Error /admin-createuser");
  }
});

app.post("/admin-updateuser", async (req, res) => {
  try {
    const { email, code } = req.body;
    const resp = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (resp.rowCount > 0) {
      const user = resp.rows[0];
      if (code == 1) {
        if (user.ethereal == null || user.ethereal == "") {
          const nEthereal = createCode();
          await client
            .query("UPDATE users SET ethereal = $1 WHERE email = $2", [
              nEthereal,
              email,
            ])
            .then(() => {
              sendTicketsEmailAdmin(email);
            });
          res.send({ mess: "Updated ethereal ticket" });
        } else {
          res.send({ mess: "Already has ethereal" });
        }
      } else if (code == 2) {
        if (user.concert == null || user.concert == "") {
          const nConcert = createCode();
          await client
            .query(
              "UPDATE users SET concert = $1 , concert_code = $2 WHERE email = $3",
              [createConcert(), nConcert, email]
            )
            .then(() => {
              sendTicketsEmailAdmin(email);
            });

          res.send({ mess: "Updated concert ticket" });
        } else {
          res.send({ mess: "Already has concert" });
        }
      }
    } else {
      res.send({ mess: "Does not exist" });
    }
  } catch {
    res.status(500).send("Error /admin-updateuser");
  }
});

app.post("/admin-get-uuser", async (req, res) => {
  try {
    const { email } = req.body;
    const resp = await client.query(
      "SELECT name, college, email FROM users WHERE email = $1",
      [email]
    );
    if (resp.rowCount > 0) {
      const user = resp.rows[0];
      res.send({
        user: {
          name: user.name,
          email: user.email,
          college: user.college,
          newEmail: email,
        },
      });
    } else {
      res.send({ mess: "Invalid User", user: false });
    }
  } catch {
    res.status(500).send("Error /admin-get-uuser");
  }
});

app.post("/admin-update-uuser", async (req, res) => {
  try {
    const { email, name, college, newEmail } = req.body;
    const resp = await client.query(
      "SELECT name, college, email FROM users WHERE email = $1",
      [email]
    );
    if (resp.rowCount > 0) {
      await client.query(
        "UPDATE users SET name = $1 , college = $2 , email = $3 WHERE email = $4",
        [name, college, newEmail, email]
      );
      res.send({
        mess: "Updated user",
      });
    } else {
      res.send({ mess: "Invalid User", user: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error /admin-update-uuser");
  }
});

const sendTicketsEmailAdmin = async (email) => {
  try {
    const resp = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = resp.rows[0];

    let htmlContent = fs.readFileSync("./email/sendTickets/index.html", "utf8");
    htmlContent = htmlContent.replace("${email_name}", user.name);
    htmlContent = htmlContent.replace("${email_ecode}", user.ethereal);
    htmlContent = htmlContent.replace("${email_ccode}", user.concert_code);
    const mailOptions = {
      from: { name: "KCG Ethereal", address: fromEmail },
      to: email,
      subject: `Ticket Status`,
      html: htmlContent,
    };
    emailTransporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

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

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file received" });
  }

  let arr = [];
  let verifiedUsers = [];
  let notVerifiedUsers = [];
  let doneUsers = [];
  let notDoneUsers = [];
  let DBarr = [];

  // Process the uploaded file here
  let transactions = loadFile(req.file.buffer);
  console.log(transactions);
  transactions = transactions.slice(13);

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
    DBarr = DbTransactions.rows;
    console.log(DbTransactions.rows);

    DbTransactions.rows.forEach((dt) => {
      const ft = arr.find((t) => t.tid == dt.transaction_id);
      console.log("-- 99 -->", ft);
      if (ft != undefined) {
        console.log(
          ft.amount,
          // fees[dt.type.toLowerCase()],
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
          notVerifiedUsers.push({
            userId: dt.user_id,
            type: dt.type,
            transactionId: ft.tid,
          });
          console.log("User not verified");
        }
      } else {
        notVerifiedUsers.push({
          userId: dt.user_id,
          type: dt.type,
          transactionId: dt.transaction_id,
        });
        console.log("User not verified");
      }
    });
  } catch (error) {
    console.log(error);
  }

  let count = 1;

  verifiedUsers.forEach(async (user) => {
    if (user.type == "ETHEREAL") {
      const ethCode = createCode();

      try {
        await client.query("UPDATE users SET ethereal= $1 WHERE id = $2", [
          ethCode,
          user.userId,
        ]);
        doneUsers.push({
          user: user,
          tickets: {
            user: user,
            tickets: {
              eth_code: ethCode,
              transactionId: user.transactionId,
            },
          },
        });
      } catch (err) {
        notDoneUsers.push({
          user: user,
          tickets: {
            user: user,
            tickets: {
              eth_code: ethCode,
              transactionId: user.transactionId,
            },
          },
        });
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

        doneUsers.push({
          user: user,
          codes: {
            concert_code: conCode,
            concert: conTicket,
            transactionId: user.transactionId,
          },
        });
      } catch (err) {
        notDoneUsers.push({
          user: user,
          codes: {
            concert_code: conCode,
            concert: conTicket,
            transactionId: user.transactionId,
          },
        });
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

        doneUsers.push({
          user: user,
          tickets: {
            ethereal: ethCode,
            concert_code: conCode,
            concert: conTicket,
            transactionId: user.transactionId,
          },
        });
      } catch (err) {
        notDoneUsers.push({
          user: user,
          tickets: {
            ethereal: ethCode,
            concert_code: conCode,
            concert: conTicket,
            transactionId: user.transactionId,
          },
        });
        console.log(err);
      }

      console.log(ethCode);
      console.log(conCode);
      console.log(conTicket);
    }
  });

  // Save arr as a JSON file
  saveToJsonFile(
    {
      DBarr: DBarr,
      arr: arr,
      verifiedUsers: verifiedUsers,
      notVerifiedUsers: notVerifiedUsers,
      doneUsers: doneUsers,
      notDoneUsers: notDoneUsers,
    },
    "transaction_data_00001.json"
  );

  sendEmail_tickets(doneUsers);

  return res.status(200).json({ message: "File uploaded successfully" });
});

app.post("/upload-test", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file received" });
  }

  let arr = [];
  let verifiedUsers = [];
  let notVerifiedUsers = [];
  let doneUsers = [];
  let notDoneUsers = [];
  let DBarr = [];

  // Process the uploaded file here
  let transactions = loadFile(req.file.buffer);
  console.log(transactions);
  transactions = transactions.slice(0);

  transactions.forEach((t) => {
    console.log("-- 97 -->", t);

    const tid = t["Remarks"].split("/")[1];
    const refname = t["Remarks"].split("/")[3];
    arr.push({
      tid: tid,
      amount: t["Deposits"],
      time: t["Date"],
      refname: refname,
    });
  });
  console.log("-- 98 -->", arr);

  try {
    const fees = await client.query("SELECT * FROM FEES");
    console.log(fees.rows[0]);

    const DbTransactions = await client.query("SELECT * FROM transactions");
    DBarr = DbTransactions.rows;
    console.log(DbTransactions.rows);

    DbTransactions.rows.forEach((dt) => {
      const ft = arr.find((t) => t.tid == dt.transaction_id);
      console.log("-- 99 -->", ft, dt);
      if (ft != undefined) {
        console.log(
          ft.amount,
          // fees[dt.type.toLowerCase()],
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
          notVerifiedUsers.push({
            userId: dt.user_id,
            type: dt.type,
            transactionId: ft.tid,
          });
          console.log("User not verified");
        }
      } else {
        notVerifiedUsers.push({
          userId: dt.user_id,
          type: dt.type,
          transactionId: dt.transaction_id,
        });
        console.log("User not verified");
      }
    });
  } catch (error) {
    console.log(error);
  }

  const outFilename = "transaction_data_00012.json";

  verifiedUsers.forEach(async (user) => {
    if (user.type == "ETHEREAL") {
      const ethCode = createCode();

      try {
        await client
          .query("UPDATE users SET ethereal= $1 WHERE id = $2", [
            ethCode,
            user.userId,
          ])
          .then(() => {
            doneUsers.push({
              user: user,
              tickets: {
                user: user,
                tickets: {
                  eth_code: ethCode,
                  transactionId: user.transactionId,
                },
              },
            });
            saveToJsonFile(
              {
                DBarr: DBarr,
                arr: arr,
                verifiedUsers: verifiedUsers,
                notVerifiedUsers: notVerifiedUsers,
                doneUsers: doneUsers,
                notDoneUsers: notDoneUsers,
              },
              outFilename
            );
          });
      } catch (err) {
        notDoneUsers.push({
          user: user,
          tickets: {
            user: user,
            tickets: {
              eth_code: ethCode,
              transactionId: user.transactionId,
            },
          },
        });
        console.log(err);
      }
      console.log("\n");
      console.log(user);
      console.log(ethCode);
    } else if (
      user.type == "IC_CONCERT" ||
      user.type == "OC_CONCERT" ||
      user.type == "IC_COMBO_CONCERT"
    ) {
      const conCode = createCode();
      const conTicket = createConcert();

      try {
        await client
          .query("UPDATE users SET concert_code= $1 WHERE id = $2", [
            conCode,
            user.userId,
          ])
          .then(async () => {
            await client.query("UPDATE users SET concert= $1 WHERE id = $2", [
              conTicket,
              user.userId,
            ]);
          })
          .then(() => {
            doneUsers.push({
              user: user,
              codes: {
                concert_code: conCode,
                concert: conTicket,
                transactionId: user.transactionId,
              },
            });
            saveToJsonFile(
              {
                DBarr: DBarr,
                arr: arr,
                verifiedUsers: verifiedUsers,
                notVerifiedUsers: notVerifiedUsers,
                doneUsers: doneUsers,
                notDoneUsers: notDoneUsers,
              },
              outFilename
            );
          });
      } catch (err) {
        notDoneUsers.push({
          user: user,
          codes: {
            concert_code: conCode,
            concert: conTicket,
            transactionId: user.transactionId,
          },
        });
        console.log(err);
      }
      console.log("\n");
      console.log(user);
      console.log(conCode);
      console.log(conTicket);
    } else if (user.type == "IC_BOTH" || user.type == "OC_COMBO") {
      const ethCode = createCode();
      const conCode = createCode();
      const conTicket = createConcert();

      try {
        await client
          .query("UPDATE users SET ethereal= $1 WHERE id = $2", [
            ethCode,
            user.userId,
          ])
          .then(async () => {
            await client.query(
              "UPDATE users SET concert_code= $1 WHERE id = $2",
              [conCode, user.userId]
            );
          })
          .then(async () => {
            await client.query("UPDATE users SET concert= $1 WHERE id = $2", [
              conTicket,
              user.userId,
            ]);
          })
          .then(() => {
            doneUsers.push({
              user: user,
              tickets: {
                ethereal: ethCode,
                concert_code: conCode,
                concert: conTicket,
                transactionId: user.transactionId,
              },
            });
            saveToJsonFile(
              {
                DBarr: DBarr,
                arr: arr,
                verifiedUsers: verifiedUsers,
                notVerifiedUsers: notVerifiedUsers,
                doneUsers: doneUsers,
                notDoneUsers: notDoneUsers,
              },
              outFilename
            );
          });
      } catch (err) {
        notDoneUsers.push({
          user: user,
          tickets: {
            ethereal: ethCode,
            concert_code: conCode,
            concert: conTicket,
            transactionId: user.transactionId,
          },
        });
        console.log(err);
      }
      console.log("\n");
      console.log(user);
      console.log(ethCode);
      console.log(conCode);
      console.log(conTicket);
    }
  });

  // Save arr as a JSON file
  saveToJsonFile(
    {
      DBarr: DBarr,
      arr: arr,
      verifiedUsers: verifiedUsers,
      notVerifiedUsers: notVerifiedUsers,
      doneUsers: doneUsers,
      notDoneUsers: notDoneUsers,
    },
    outFilename
  );

  console.log(doneUsers);

  return res.status(200).json({ message: "File uploaded successfully" });
});

const sendEmail_tickets = async (toSendUsers) => {
  let arr = [];

  const users = await client.query("SELECT * FROM users", []);
  toSendUsers.forEach((tsUser) => {
    const filtered = users.rows.filter((user) => user.id == tsUser.user.userId);
    arr.push({ user: filtered[0], tid: tsUser.user.transactionId });
  });

  // arr = [
  //   {
  //     user: {
  //       id: "bbe53b47-9523-4941-b30a-e9d98eb37caf",
  //       name: "Dharun",
  //       email: "20ad09@kcgcollege.com",
  //       phone: "6382298084",
  //       ethereal: null,
  //       concert: "concert_dsfasfads_ASDfsdf_ASdfasfs_SDFadf",
  //       combo_eligible: null,
  //       logged_in: true,
  //       otp: null,
  //       college: "KCG College Of Technology",
  //       concert_code: 12345,
  //     },
  //     tid: "326911260001",
  //   },
  //   {
  //     user: {
  //       id: "7632f4f6-9c9c-4948-8fc3-5f0e59c13c80",
  //       name: "Sricharan",
  //       email: "onlysricharan@gmail.com",
  //       phone: "6380688350",
  //       ethereal: null,
  //       concert: null,
  //       combo_eligible: null,
  //       logged_in: true,
  //       otp: null,
  //       college: "K.C.G. College of Technology, Chennai",
  //       concert_code: null,
  //     },
  //     tid: "326911260002",
  //   },
  //   {
  //     user: {
  //       id: "7632f4f6-9c9c-4948-8fc3-5f0e59c13c80",
  //       name: "Sricharan",
  //       email: "dharunsivakumar@gmail.com",
  //       phone: "6380688350",
  //       ethereal: null,
  //       concert: null,
  //       combo_eligible: null,
  //       logged_in: true,
  //       otp: null,
  //       college: "K.C.G. College of Technology, Chennai",
  //       concert_code: null,
  //     },
  //     tid: "326911260002",
  //   },
  // ];

  arr.forEach((user) => {
    let htmlContent = fs.readFileSync("./email/sendTickets/index.html", "utf8");
    console.log("HTML content:", htmlContent);
    htmlContent = htmlContent.replace("${email_name}", user.user.name);
    htmlContent = htmlContent.replace("${email_ecode}", user.user.ethereal);
    htmlContent = htmlContent.replace("${email_ccode}", user.user.concert_code);

    const mailOptions = {
      from: { name: "KCG Ethereal", address: fromEmail },
      to: user.user.email,
      subject: `Ticket Status (Updated) ${user.tid}`,
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
  });
};

// Function to save an array as a JSON file
function saveToJsonFile(data, fileName) {
  fs.writeFileSync(fileName, JSON.stringify(data));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/qr-scanner", async (req, res) => {
  try {
    console.log("Origins -> ", req.headers.origin);
    console.log("Headers ->", req.headers);
    const { code } = req.body;

    const now = new Date();
    const currentTime = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const dbRes = await client.query("SELECT * FROM qr WHERE code = $1", [
      code,
    ]);

    if (dbRes.rowCount == 0) {
      res.send({ valid: false });
      return;
    } else {
      const row = dbRes.rows[0];
      const lastScanned = row.last_scanned == undefined ? [] : row.last_scanned;
      console.log(lastScanned);
      const sendData = {
        valid: true,
        name: row.name,
        lastScanned: lastScanned,
      };
      res.send(sendData);

      lastScanned.push(currentTime);
      await client.query("UPDATE qr SET last_scanned = $1 WHERE code = $2", [
        lastScanned,
        code,
      ]);
    }
  } catch (error) {
    res.send({ error: "Error in /qr-scanner " + error });
  }
});

// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------

const QRCode = require("qrcode");
const puppeteer = require("puppeteer");

app.post("/downloadQRpdf", async (req, res) => {
  try {
    const { name, code } = req.body;
    const qrData = await QRCode.toDataURL(code);
    let html = `<div id="root">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: "Orbitron", sans-serif;
        color: white;
      }
      #root {
        width: 500px;
        height: 500px;
        /* background-color: gray; */
        overflow: hidden;
      }
      .bgImg {
        width: 500px;
        height: 500px;
        overflow: hidden;
        position: relative;
        z-index: -1;
        position: absolute;
      }
      .bgImg img {
        width: 105%;
        filter: blur(10px);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
  
      .qrImg {
        width: 250px;
        height: 250px;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
      }
      .qrImg img {
        width: 100%;
        height: 100%;
        scale: 1.15;
      }
      .content {
        width: 500px;
        height: 500px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
      }
      .concert {
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
      h1 {
        font-weight: 900;
      }
      .logo {
        width: 50px;
        height: 50px;
        position: absolute;
        bigt: 20px;
        right: 20px;
      }
      .logo img {
        width: 100%;
      }
    </style>
    <div class="bgImg">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/Pradeep.png?alt=media&token=593a76ef-3881-46fe-92c8-9911ff4c8067"
        alt="bgImg"
      />
    </div>
    <div class="content">
      <div class="text">
        <h1>{name}</h1>
        <p>Oct 13, 2023</p>
      </div>
  
      <div class="qrImg">
        <img src="{qr}" alt="qrImg" />
      </div>
  
      <div class="logo">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/favicon.png?alt=media&token=169a1dfc-3445-45de-a90c-9f7cc7085c5d"
          alt="logo"
        />
      </div>
  
      <p class="concert">Concert Ticket</p>
    </div>
  </div>
  `;
    html = html.replace("{name}", name);
    html = html.replace("{qr}", qrData);

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setContent(html);

    // await page.pdf({
    //   width: "500px",
    //   height: "500px",
    //   printBackground: true,
    // });
    await page.setViewport({ width: 500, height: 500 });
    const screenshot = await page.screenshot();

    await browser.close();
    res.send(screenshot);
  } catch (error) {
    console.log(error);
  }
});

app.post("/admin-create-white", async (req, res) => {
  try {
    const { name } = req.body;
    const concert = createConcert();
    const qrData = await QRCode.toDataURL(concert);
    let html = `<div id="root">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: "Orbitron", sans-serif;
        color: white;
      }
      #root {
        width: 500px;
        height: 500px;
        /* background-color: gray; */
        overflow: hidden;
      }
      .bgImg {
        width: 500px;
        height: 500px;
        overflow: hidden;
        position: relative;
        z-index: -1;
        position: absolute;
      }
      .bgImg img {
        width: 105%;
        filter: blur(10px);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
  
      .qrImg {
        width: 250px;
        height: 250px;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
      }
      .qrImg img {
        width: 100%;
        height: 100%;
        scale: 1.15;
      }
      .content {
        width: 500px;
        height: 500px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
      }
      .concert {
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
      h1 {
        font-weight: 900;
      }
      .logo {
        width: 50px;
        height: 50px;
        position: absolute;
        bigt: 20px;
        right: 20px;
      }
      .logo img {
        width: 100%;
      }
    </style>
    <div class="bgImg">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/Pradeep.png?alt=media&token=593a76ef-3881-46fe-92c8-9911ff4c8067"
        alt="bgImg"
      />
    </div>
    <div class="content">
      <div class="text">
        <h1>{name}</h1>
        <p>Oct 13, 2023</p>
      </div>
  
      <div class="qrImg">
        <img src="{qr}" alt="qrImg" />
      </div>
  
      <div class="logo">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/favicon.png?alt=media&token=169a1dfc-3445-45de-a90c-9f7cc7085c5d"
          alt="logo"
        />
      </div>
  
      <p class="concert">Concert Ticket</p>
    </div>
  </div>
  `;
    html = html.replace("{name}", name);
    html = html.replace("{qr}", qrData);

    await client.query("INSERT INTO qr(name, code) VALUES( $1, $2 )", [
      name,
      concert,
    ]);

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setContent(html);

    // await page.pdf({
    //   width: "500px",
    //   height: "500px",
    //   printBackground: true,
    // });
    await page.setViewport({ width: 500, height: 500 });
    const screenshot = await page.screenshot();

    await browser.close();
    res.send(screenshot);
  } catch (error) {
    console.log(error);
  }
});

app.post("/admin-existing-qr", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const resp = await client.query(
      "SELECT name, concert FROM users WHERE email = $1",
      [email]
    );
    if (resp.rowCount == 0) {
      res.send(false);
      return;
    }
    console.log(resp.rows[0]);

    const name = resp.rows[0].name;
    const concert = resp.rows[0].concert;
    const qrData = await QRCode.toDataURL(concert);
    let html = `<div id="root">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: "Orbitron", sans-serif;
        color: white;
      }
      #root {
        width: 500px;
        height: 500px;
        /* background-color: gray; */
        overflow: hidden;
      }
      .bgImg {
        width: 500px;
        height: 500px;
        overflow: hidden;
        position: relative;
        z-index: -1;
        position: absolute;
      }
      .bgImg img {
        width: 105%;
        filter: blur(10px);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
  
      .qrImg {
        width: 250px;
        height: 250px;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
      }
      .qrImg img {
        width: 100%;
        height: 100%;
        scale: 1.15;
      }
      .content {
        width: 500px;
        height: 500px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
      }
      .concert {
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
      h1 {
        font-weight: 900;
      }
      .logo {
        width: 50px;
        height: 50px;
        position: absolute;
        bigt: 20px;
        right: 20px;
      }
      .logo img {
        width: 100%;
      }
    </style>
    <div class="bgImg">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/Pradeep.png?alt=media&token=593a76ef-3881-46fe-92c8-9911ff4c8067"
        alt="bgImg"
      />
    </div>
    <div class="content">
      <div class="text">
        <h1>{name}</h1>
        <p>Oct 13, 2023</p>
      </div>
  
      <div class="qrImg">
        <img src="{qr}" alt="qrImg" />
      </div>
  
      <div class="logo">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/ethereal-test-2023.appspot.com/o/favicon.png?alt=media&token=169a1dfc-3445-45de-a90c-9f7cc7085c5d"
          alt="logo"
        />
      </div>
  
      <p class="concert">Concert Ticket</p>
    </div>
  </div>
  `;
    html = html.replace("{name}", name);
    html = html.replace("{qr}", qrData);

    await client.query("INSERT INTO qr(name, code) VALUES( $1, $2 )", [
      name,
      concert,
    ]);

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setContent(html);

    // await page.pdf({
    //   width: "500px",
    //   height: "500px",
    //   printBackground: true,
    // });
    await page.setViewport({ width: 500, height: 500 });
    const screenshot = await page.screenshot();

    await browser.close();
    res.send(screenshot);
  } catch (error) {
    console.log(error);
  }
});
