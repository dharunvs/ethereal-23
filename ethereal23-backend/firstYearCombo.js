const fs = require("fs");
const Papa = require("papaparse");
const csvWriteStream = require("csv-write-stream");

const { v4: uuidv4 } = require("uuid");

function createCode() {
  const uniqueId = uuidv4().toString();
  const code = uniqueId.replace(/-/g, "").slice(0, 6);
  return code;
}

const createConcert = () => {
  const uuid = uuidv4().toString();
  const ticket = "concert_" + uuid;
  return ticket;
};

const writer = csvWriteStream();

const csvData = fs.readFileSync("firstYearCombo.csv", "utf8");
Papa.parse(csvData, {
  header: true, // Set to true if the first row of your CSV file contains headers
  skipEmptyLines: true,
  complete: function (results) {
    const records = results.data;
    console.log(records);

    const outputFile = "firstYearCombo-001.csv";
    const writableStream = fs.createWriteStream(outputFile);
    writer.pipe(writableStream);

    records.forEach((record) => {
      record = {
        Name: record.Name,
        Email: record.Email,
        Ethereal_Code: createCode(),
        Concert_Code: createCode(),
        Concert_QR: createConcert(),
      };
      writer.write(record);
    });

    // End the writable stream to finish writing the file
    writer.end();
  },
});
