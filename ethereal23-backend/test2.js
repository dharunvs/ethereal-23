const fs = require("fs");
const filepath = "transaction_data_00011.json";

fs.readFile(filepath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the JSON data into a JavaScript object
  const a = JSON.parse(data);
  console.log(filepath);
  console.log({
    DBarr: a.DBarr.length,
    arr: a.arr.length,
    verifiedUsers: a.verifiedUsers.length,
    done: a.doneUsers.length,
  });
  // Now, you can work with jsonData
});
